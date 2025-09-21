import dotenv from "dotenv";
import * as fs from "node:fs";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const ai = new GoogleGenAI({
     apiKey: process.env.GEMINI_API_KEY,
});

const Category = createEnum(["movie", "tv", "manga", "others"]);

async function acquireMetadata(imageFile) {
     const contents = [
          {
               inlineData: {
                    mimeType: "image/jpeg",
                    data: imageFile,
               },
          },
     ];

     const response = await ai.models.generateContent({
          model: "gemini-2.5-pro",
          config: {
               systemInstruction: fs.readFileSync(
                    "metadataSystemInstructions.txt",
                    "utf8",
               ),
          },
          contents: contents,
     });

     // Extract text and handle edge cases
     let responseText;
     if (response.text) {
          responseText = typeof response.text === 'function' ? response.text() : response.text;
     } else if (response.candidates && response.candidates[0]) {
          responseText = response.candidates[0].content.parts[0].text;
     } else {
          console.error("Unable to extract text from response:", response);
          return null;
     }

     console.log("Response text:", responseText);
     return parseMarkdown(responseText);
}

async function handleApiCalls(data, isAdult = true) {
     if (!Category.match(data.category)) {
          throw new Error(`Invalid category: ${data.category}. Valid categories are: ${Object.values(Category).join(", ")}`);
     }

     const validCategory = Category.match(data.category);

     // Preferntial usage of name in order to ensure that the most common name is used, still experimental
     const query = data.translatedName || data.transliteratedName || data.name;
     if (!query) {
         throw new Error("No valid name found in metadata");
     }

     if (validCategory === Category.tv || validCategory === Category.movie) {
          return await tmdb(query, data.category, isAdult);

     } else if (validCategory === Category.manga) {
          return await anilist(query);
     }else if(validCategory === Category.others){
          // TODO: implement api calls for "other" categories
          throw new Error(`Api calls for "other" categories not yet implemented`);
     }else {
          throw new Error(`Unhandled category: ${data.category}`);
     }
}

async function tmdb(query, category, isAdult = true) {
     const url = `https://api.themoviedb.org/3/search/${category}?query=${encodeURIComponent(query)}&include_adult=${isAdult}&language=en-US&page=1`;
     const options = {
          method: "GET",
          headers: {
               accept: "application/json",
               Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
     };

     try {
          const res = await fetch(url, options);
          const json = await res.json();

          if(json.total_results === 0) {
               throw new Error(`No search results found for "${query}"`);
          }

          return json.results; // Returns array
     } catch (err) {
          throw err;
     }
}

async function anilist(searchName) {
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        media(search: $search, type: MANGA) {
          id
          title {
            romaji
            english
            native
          }
          description(asHtml: false)
          genres
          coverImage {
            extraLarge
          }
          startDate {
            year
          }
          status
          averageScore
          chapters
          volumes
          siteUrl
        }
      }
    }
  `;

  const variables = {
    search: searchName
  };

  const url = 'https://graphql.anilist.co';

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if(data.data.Page.media.length === 0){
         throw new Error(`No results found for ${searchName}`);
    }

    return data.data.Page.media; //Returns only the array of results

  } catch (error) {
    console.error('Could not fetch manga:', error);
  }
}

async function closestMatch(metaData, queryData) {
     if (queryData.length === 0) {
          throw new Error(`No search results found`);
     } else if (queryData.length === 1) {
          return queryData[0];
     } else {
          const response = await ai.models.generateContent({
               model: "gemini-2.5-flash",
               config: {
                    systemInstruction: fs.readFileSync(
                         "closestMatchSystemInstructions.txt",
                         "utf8",
                    ),
               },
               contents: `The basic object: ${JSON.stringify(metaData)} \n The query response: ${JSON.stringify(queryData)} \n`,
          });

          return parseMarkdown(response.text);
     }
}

export async function testAPI(path) {
     const base64ImageFile = fs.readFileSync(path, {
          encoding: "base64",
     });

     try {
          console.log("🚀 STEP 1: Starting metadata acquisition from image...");
          let metaData = await acquireMetadata(base64ImageFile);
          console.log(JSON.stringify(metaData, null, 2));
          console.log("─".repeat(50));

          let browse = await handleApiCalls(metaData);
          console.log("✅ STEP 2 COMPLETED: API call executed successfully");
          console.log("📊 Browse results:", JSON.stringify(browse, null, 2));
          console.log("─".repeat(50));

          console.log("🎯 STEP 3: Finding closest match...");
          let closest = await closestMatch(metaData, browse);
          console.log("✅ STEP 3 COMPLETED: Closest match found");
          console.log("📊 Closest match:", JSON.stringify(closest, null, 2));
          console.log("─".repeat(50));

          console.log("🔄 STEP 4: Merging objects...");
          let mergedData = deepMergeObjects(metaData, closest);
          console.log("✅ STEP 4 COMPLETED: Objects merged successfully");
          console.log("📊 Merged data:", JSON.stringify(mergedData, null, 2));
          console.log("─".repeat(50));

          console.log("🎨 STEP 5: Reconciling final object data...");
          let finalResult = reconcileObjectData(mergedData, metaData.category);

          console.log("✅ STEP 5 COMPLETED: Object data reconciled");
          console.log("📊 Final result:", JSON.stringify(finalResult, null, 2));
          console.log("🎉 ALL STEPS COMPLETED SUCCESSFULLY!");
          console.log("=".repeat(50));

          return finalResult; // The properties with the same name are overridden

     } catch (error) {
          console.error("❌ Error in handlePostReq:", error);
          console.log("=".repeat(50));
          throw error;
     }
}

function deepMergeObjects(obj1, obj2) {
    if (!obj1 || typeof obj1 !== 'object') obj1 = {};
    if (!obj2 || typeof obj2 !== 'object') obj2 = {};

    const result = { ...obj1 };

    for (const key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            if (typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj2[key])) {
                if (typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
                    result[key] = deepMergeObjects(result[key], obj2[key]);
                } else {
                    result[key] = deepMergeObjects({}, obj2[key]);
                }
            } else {
                result[key] = obj2[key];
            }
        }
    }

    return result;
}

function reconcileObjectData(data){
     if (!Category.match(data.category)) {
          throw new Error(`Empty object or Invalid category: ${data.category}. Valid categories are: ${Object.values(Category).join(", ")}`);
     }

     const validCategory = Category.match(data.category);

     if (validCategory === Category.tv || validCategory === Category.movie) {
          // Source: https://www.themoviedb.org/talk/5daf6eb0ae36680011d7e6ee
          const genreId = { 28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western" };
          let mappedGenres = [];
          for(const id of data.genre_ids){
               mappedGenres.push(genreId[id])
          }

          const obj = {
               description : data.overview,
               title: {
                    name : data.name,
                    originalName: data.original_name,
                    transliteratedName : data.transliteratedName || "Not found"
               },
               category: data.category,
               genres: mappedGenres,
               startDate: data.first_air_date,
               averageScore: data.vote_average,
               coverImage : `https://image.tmdb.org/t/p/original/${data.poster_path}`
          }
          return obj
     } else if (validCategory === Category.manga) {
          console.log("manga")

          const obj = {
               description : data.description,
               title: {
                    name : data.title.english || data.name,
                    originalName: data.title.native,
                    transliteratedName : data.title.romaji
               },
               category: data.category,
               genres: data.genres,
               startDate: data.startDate.year,
               averageScore: data.averageScore,
               coverImage : data.coverImage.extraLarge
          }
          return obj
     }else if(validCategory === Category.others){
          throw new Error(`"Other" categories not yet implemented`);
     }else {
          throw new Error(`Unhandled category: ${data.category}`);
     }
} // TODO: Figure out what to do if some of the atrributes are null (api's fault)

function parseMarkdown(markdownString) {
     // First, try the original markdown code block pattern
     const codeBlockRegex = /```(?:javascript|json)?\s*({[\s\S]*?})\s*```/;
     let match = markdownString.match(codeBlockRegex);

     if (match && match[1]) {
          try {
               return JSON.parse(match[1]);
          } catch (e) {
               console.error("Error parsing object from code block:", e);
          }
     }

     // If no code block, try to find JSON object directly
     const jsonRegex = /\{[\s\S]*\}/;
     match = markdownString.match(jsonRegex);

     if (match) {
          try {
               return JSON.parse(match[0]);
          } catch (e) {
               console.error("Error parsing JSON object:", e);
          }
     }

     // If still no match, try to extract just the response text and see if it's valid JSON
     try {
          return JSON.parse(markdownString.trim());
     } catch (e) {
          console.error("Response is not valid JSON:", e);
          console.log("Raw response:", markdownString);
          return null;
     }
}

function createEnum(arr) {
     let obj = Object.create(null);
     for (let val of arr) {
          obj[val] = Symbol(val);
     }

     obj.match = function (text) {
          for (let key in this) {
               if (typeof this[key] === "symbol" && text === key) {
                    return this[key];
               }
          }
          return null;
     };

     return Object.freeze(obj);
}
