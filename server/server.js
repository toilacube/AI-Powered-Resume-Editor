// server/server.js

import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// --- Middleware ---
// Allow requests from your frontend ( Vite runs on 5173 by default)
app.use(cors({ origin: "http://localhost:5173" }));
// Allow the server to parse JSON request bodies
app.use(express.json());

// --- OpenAI Client Initialization ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// --- API Route ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message, currentData } = req.body;

    if (!message || !currentData) {
      return res
        .status(400)
        .json({ error: "Message and currentData are required." });
    }

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
    const completion = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0].message.content;
    res.json(JSON.parse(responseContent));
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({
      error: "Failed to communicate with OpenAI",
      details: error.message,
    });
  }
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
