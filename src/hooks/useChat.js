import { useState, useCallback } from "react";
import { callOpenAI } from "../utils/openaiService";

export const useChat = (onResumeUpdate, currentData) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your CV assistant. I can help you update your resume, analyze job postings, or provide suggestions.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (message) => {
      if (!message.trim() || isLoading) return;

      const userMessage = { role: "user", content: message };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await callOpenAI(message, currentData);

        if (response.action === "update_cv" && response.data) {
          onResumeUpdate(response.data);
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.message || "I've updated your resume!",
          },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Sorry, I encountered an error: ${error.message}`,
          },
        ]);
      }

      setIsLoading(false);
    },
    [isLoading, currentData, onResumeUpdate]
  );

  return {
    messages,
    isLoading,
    sendMessage,
  };
};
