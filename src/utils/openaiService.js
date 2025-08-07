// src/utils/geminiService.js

import { GoogleGenAI } from "@google/genai";
import resumeSchema from "../data/resumeSchema.json";

export const callOpenAI = async (
  message,
  currentData,
  key,
  model = "gemini-2.0-flash-lite"
) => {
  if (!key) {
    throw new Error(
      "Gemini API key is missing. Please provide it to continue."
    );
  }

  const genAI = new GoogleGenAI({ apiKey: key });

  const systemPrompt = `
    You are an expert CV/Resume assistant. Your task is to act as a JSON transformation engine.
    Based on the user's request, you MUST generate a valid JSON Patch (RFC 6902) array to modify the user's current CV data.
    
    The JSON Patch format is an array of operations. The main operations are "add", "remove", and "replace".
    - 'op': The operation to perform.
    - 'path': A JSON Pointer path to the target location (e.g., "/contact/email"). For array elements, use "/experience/0/role". To add to the end of an array, use "/skills/languages/-".
    - 'value': The new value for "add" or "replace" operations.
    
    You MUST respond with a single, valid JSON object with the following structure:
    {
      "patches": <the JSON Patch array you generated>,
      "message": "<A user-facing message explaining what you did>"
    }
    
    EXAMPLE:
    - User says: "Change my phone number to 555-1234 and add 'Go' to my languages."
    - Your response MUST be:
    {
      "patches": [
        { "op": "replace", "path": "/contact/phone", "value": "555-1234" },
        { "op": "add", "path": "/skills/languages/-", "value": "Go" }
      ],
      "message": "I've updated your phone number and added 'Go' to your skills."
    }
    
    If the user is just chatting or asking for analysis (not a direct data change), return an empty "patches" array and put your response in the "message" field.
    
    Current CV JSON data:
    ${JSON.stringify(currentData, null, 2)}
    `;

  const fullPrompt = `${systemPrompt}\n\nUser Request: "${message}"`;

  try {
    const result = await genAI.models.generateContent({
      model: model,
      contents: fullPrompt,
    });
    let responseText = result.text;

    // remove ```json and ```
    responseText = responseText.replace("```json", "").replace("```", "");

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(
      `Failed to communicate with the Gemini API. Please check your API key and network connection. Details: ${error.message}`
    );
  }
};

/**
 * Extracts content from a PDF file using Gemini and structures it
 * according to the provided resume JSON schema.
 * @param {string} fileBase64 - The base64 encoded string of the PDF file.
 * @param {string} key - The Gemini API key.
 * @param {string} model - The Gemini model to use.
 * @returns {Promise<object>} The extracted resume data as a JSON object.
 */
export const extractDataFromPdf = async (
  fileBase64,
  key,
  model = "gemini-2.0-flash-lite"
) => {
  if (!key) {
    throw new Error(
      "Gemini API key is missing. Please provide it to continue."
    );
  }

  const genAI = new GoogleGenAI({ apiKey: key });

  const systemPrompt = `You are an intelligent resume parser. Your task is to analyze the provided PDF document and extract its content into a structured JSON format. 

The output MUST be a single, valid JSON object that strictly conforms to the following JSON Schema. Do not include any extra text, explanations, or markdown formatting like \`\`\`json.

If a value for a specific field cannot be found in the document, you MUST use an empty string "" for string types or an empty array [] for array types.

JSON Schema to follow:
${JSON.stringify(resumeSchema, null, 2)}`;

  const contents = [
    { text: systemPrompt },
    {
      inlineData: {
        mimeType: "application/pdf",
        data: fileBase64,
      },
    },
  ];

  try {
    const result = await genAI.models.generateContent({
      model,
      contents,
    });
    let responseText = result.text;

    console.log(responseText);

    // Clean up potential markdown formatting from the response
    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse and return the JSON object
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error calling Gemini API for PDF extraction:", error);
    throw new Error(
      `Failed to extract data from PDF. Details: ${error.message}`
    );
  }
};
