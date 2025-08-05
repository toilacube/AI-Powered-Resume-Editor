// src/utils/openaiService.js

import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// -----------------------------------------------------------------------------
// WARNING: This is a client-side only application.
// The API key is exposed to the browser, which is a security risk.
// This approach is suitable for personal projects run locally.
// Do NOT deploy this to a public website without moving the API
// call to a secure backend or serverless function.
// -----------------------------------------------------------------------------

let openai;
if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // This is required for frontend-only usage.
  });
}

export const callOpenAI = async (message, currentData) => {
  if (!openai) {
    console.warn("OpenAI API key not found. Using mock response.");
    return {
      action: "chat",
      message: "This is a mock response because the OpenAI API key is not configured. Please set it in your .env file.",
    };
  }

  const systemPrompt = `
You are an expert CV/Resume assistant. Your task is to process user requests to modify a CV, which is represented in JSON format.
Analyze the user's request and the current CV data.
You MUST respond with a single, valid JSON object and nothing else.

The JSON response should have the following structure:
{
  "action": "update_cv" | "analyze_job" | "suggest" | "chat",
  "data": <the complete, updated CV JSON object if action is 'update_cv', otherwise null>,
  "message": "<A user-facing message explaining what you did>"
}

EXAMPLE:
- User says: "Change my name to John Doe and add a new skill: 'GraphQL'"
- You should return:
{
  "action": "update_cv",
  "data": { /* ... the entire CV JSON, but with the name changed to "John Doe" and "GraphQL" added to skills.languages ... */ },
  "message": "I've updated your name to John Doe and added GraphQL to your skills."
}

If the user asks to analyze a job description, use the "analyze_job" action and provide your analysis in the "message" field.
If the user is just chatting, use the "chat" action.

Current CV JSON data:
${JSON.stringify(currentData, null, 2)}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo', // A powerful and modern model good for JSON tasks
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" } // Enforce JSON output
    });

    const responseContent = completion.choices[0].message.content;

    if (!responseContent) {
      throw new Error("Received an empty response from OpenAI.");
    }
    
    // The SDK returns the JSON as a string, so we still need to parse it.
    return JSON.parse(responseContent);

  } catch (error) {
    console.error('OpenAI API error:', error);
    // The SDK provides more descriptive error messages.
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};