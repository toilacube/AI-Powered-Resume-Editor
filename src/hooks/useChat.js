// src/hooks/useChat.js

import { useState, useCallback } from 'react';
// We now import the backend service, not the openai one directly
import { callOpenAI } from '../utils/openaiService'; 

// 1. Accept apiKey and model as arguments
export const useChat = (onResumeUpdate, currentData, apiKey, model = "gemini-2.0-flash") => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      // Update initial message
      content: "👋 Hi! I can help you update your resume. Please enter your Gemini API key below to get started."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 2. Pass apiKey and model to the service function
      const response = await callOpenAI(message, currentData, apiKey, model);

      // --- NEW LOGIC ---
      // Check if there are any patches to apply
      if (response.patches && response.patches.length > 0) {
        // Pass the original user message text along with the patches
        onResumeUpdate(response.patches, message);
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message || 'An unexpected response format was received.'
      }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`
      }]);
    }

    setIsLoading(false);
  // 3. Add apiKey to the dependency array
  }, [isLoading, currentData, onResumeUpdate, apiKey, model]);

  return {
    messages,
    isLoading,
    sendMessage
  };
};