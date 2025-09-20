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

async function handleApiCalls(query, category, isAdult = true) {
     if (!Category.match(category)) {
          throw new Error(`Invalid category: ${category}. Valid categories are: ${Object.values(Category).join(", ")}`);
     }

     const validCategory = Category.match(category); // This is a 'Symbol'; check if type errors occur

     if (validCategory === Category.tv || validCategory === Category.movie) {
          return await tmdb(query, category, isAdult);

     } else if (validCategory === Category.manga) {
          return await anilist(query);
     }else if(validCategory === Category.others){
          // TODO: implement api calls for "other" categories
          throw new Error(`Api calls for "other" categories not yet implemented`);
     }else {
          throw new Error(`Unhandled category: ${category}`);
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
          .then((res) => res.json())
          .then((json) => json)
          .catch((err) => console.error(err));
}

//TODO: Implement error case when there are no search results, also first check the type of return variables
// TODO: update closestMatchSystemInstructions to reflect the new anilist api (also remove ambiguity of the return type)

export async function anilist(searchName) {
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

export async function handlePostReq(path) {
     const base64ImageFile = fs.readFileSync(path, {
          encoding: "base64",
     });

     try {
          let metaData = await acquireMetadata(base64ImageFile);
          let browse = await handleApiCalls(metaData.name, metaData.category);
          let closest = await closestMatch(metaData, browse);
          return deepMergeObjects(metaData, closest); // The properties with the same name are overridden

     } catch (error) {
          console.error("Error in handlePostReq:", error);
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

// TODO write a function to deal with data discrepencies and for providing them to a frontend