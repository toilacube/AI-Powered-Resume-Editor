// src/hooks/useChat.js

import { useState, useCallback, useEffect } from "react";
import { callOpenAI } from "../utils/openaiService";
import { useProjectData } from "./useProjectData";

/**
 * Project-aware chat hook
 * @param {Function} onResumeUpdate - Function to handle resume updates
 * @param {Object} currentData - Current resume data
 * @param {string} apiKey - API key for AI service
 * @param {string} model - AI model to use
 * @param {string|null} projectId - ID of the active project
 * @param {Function} onUpdateLastMessage - Function to update last chat message preview
 * @returns {Object} Chat functions and state
 */
export const useChat = (
  onResumeUpdate,
  currentData,
  apiKey,
  model = "gemini-2.0-flash",
  projectId = null,
  onUpdateLastMessage = null
) => {
  const { chatHistory, updateChatHistory } = useProjectData(projectId);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I can help you update your resume. Please enter your Gemini API key below to get started.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync messages with project chat history
  useEffect(() => {
    if (projectId && chatHistory.length > 0) {
      setMessages(chatHistory);
    } else {
      setMessages([
        {
          role: "assistant",
          content:
            "👋 Hi! I can help you update your resume. Please enter your Gemini API key below to get started.",
        },
      ]);
    }
  }, [projectId, chatHistory]);

  const sendMessage = useCallback(
    async (message) => {
      if (!message.trim() || isLoading) return;

      const userMessage = { role: "user", content: message };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const response = await callOpenAI(message, currentData, apiKey, model);

        const assistantMessage = {
          role: "assistant",
          content:
            response.message || "An unexpected response format was received.",
        };

        const finalMessages = [...newMessages, assistantMessage];
        setMessages(finalMessages);

        // Save chat history to project if we have a project ID
        if (projectId) {
          await updateChatHistory(finalMessages);

          // Update last message preview
          if (onUpdateLastMessage) {
            onUpdateLastMessage(projectId, message);
          }
        }

        // Check if there are any patches to apply
        if (response.patches && response.patches.length > 0) {
          onResumeUpdate(response.patches, message);
        }
      } catch (error) {
        const errorMessage = {
          role: "assistant",
          content: `Sorry, I encountered an error: ${error.message}`,
        };

        const finalMessages = [...newMessages, errorMessage];
        setMessages(finalMessages);

        // Save error message to project chat history too
        if (projectId) {
          await updateChatHistory(finalMessages);
        }
      }

      setIsLoading(false);
    },
    [
      isLoading,
      currentData,
      onResumeUpdate,
      apiKey,
      model,
      messages,
      projectId,
      updateChatHistory,
      onUpdateLastMessage,
    ]
  );

  return {
    messages,
    isLoading,
    sendMessage,
  };
};
