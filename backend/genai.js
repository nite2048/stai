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
          model: "gemini-2.5-flash",
          config: {
               systemInstruction: fs.readFileSync(
                    "metadataSystemInstructions.txt",
                    "utf8",
               ),
          },
          contents: contents,
     });
     return parseMarkdown(response.text);
}
//FIXME: Loner gf manga identifies incorectly as a tv show (T-T kill me now)
//FIXME: IT CANT FUCKING DIFFERENTIATE BETWEEN PUNCTUATIONS AND "OR" OR "AND"
// Maybe use a better model


async function handleApiCalls(data, isAdult = true) {
     if (!Category.match(data.category)) {
          throw new Error(`Invalid category: ${data.category}. Valid categories are: ${Object.values(Category).join(", ")}`);
     }

     let query;
     const validCategory = Category.match(data.category); // This is a 'Symbol'; check if type errors occur

     // Preferntial usage of name in order to ensure that the most common name is used, still experimental
     // Initially implemented cuz i ran into some edge cases with the Takopi screenshot
     // Seems logical enough but it is definately a temporary fix
     
     if(data.translatedName != "" || data.translatedName != null || data.translatedName != undefined){
          query = data.translatedName;
     }else if(data.transliteratedName != "" || data.transliteratedName != null || data.transliteratedName != undefined){
          query = data.transliteratedName;
     }else if(data.name != "" || data.name != null || data.name != undefined){
          query = data.name;
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

     return fetch(url, options)
          .then((res) => {
               return res.json();
          })
          .then((json) => {
               return json;
          })
          .catch((err) => {
               throw err;
          });
}

//TODO: Implement error case when there are no search results, also first check the type of return variables
//TODO: update closestMatchSystemInstructions to reflect the new anilist api (also remove ambiguity of the return type)

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
    return data.data.Page.media; //Returns only the array of results

  } catch (error) {
    console.error('Could not fetch manga:', error);
  }
}

async function closestMatch(metaData, queryData) {
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

     const validCategory = Category.match(data.category); // This is a 'Symbol'; check if type errors occur

     if (validCategory === Category.tv || validCategory === Category.movie) {
          console.log("tv & movie")
          const obj = {
               description : data.overview,
               title: {
                    name : data.name,
                    originalName: data.originalName,
                    transliteratedName : (data.transliteratedName != "" || data.transliteratedName != null || data.transliteratedName != undefined) ? data.transliteratedName : null
               },
               category: data.category,
               genres: data.genre,
               startDate: data.firstAirDate,
               averageScore: data.voteAverage,
               coverImage : `https://image.tmdb.org/t/p/original/${data.posterPath}`
          }
          return obj
     } else if (validCategory === Category.manga) {
          console.log("manga")

          const obj = {
               description : data.description,
               title: {
                    name : data.title.english, // Api names are preffered over the metaData ones
                    originalName: data.title.native,
                    transliteratedName : data.title.romaji
               },
               category: data.category,
               genres: data.genres[0],
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
}
// TODO: Deal with genre discrepancies properly (i hate it) 
// Both tmdb and anilist send genre arrays map them properly. tmdb sends genre ids for some reason so send another api request to retrieve the genres
// Deal with array mapping cause its insane

function parseMarkdown(markdownString) {
     const regex = /```(?:javascript\s*(?:\{[^{}]*\})?)?\s*({[\s\S]*?})\s*```/;
     const match = markdownString.match(regex);

     if (match && match[1]) {
          const objectString = match[1];
          try {
               return JSON.parse(objectString);
          } catch (e) {
               console.error("Error parsing object string from Markdown:", e);
               return null;
          }
     } else {
          console.error(
               "No valid JavaScript object found within a code block.",
          );
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