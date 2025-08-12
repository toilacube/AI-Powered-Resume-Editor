/**
 * @fileoverview Project-specific data management hook
 *
 * This hook manages project-specific resume data, chat history, and resume history
 * with automatic synchronization to localStorage.
 */

import { useState, useEffect, useCallback } from "react";
import { ProjectStorage } from "../utils/projectStorage.js";
import initialResumeData from "../data/resumeData.json";

/**
 * Hook for managing project-specific data
 * @param {string|null} projectId - ID of the active project
 * @returns {Object} Project data management functions and state
 */
export const useProjectData = (projectId) => {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [chatHistory, setChatHistory] = useState([]);
  const [resumeHistory, setResumeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load project data when projectId changes
  useEffect(() => {
    if (projectId) {
      loadProjectData(projectId);
    } else {
      // Reset to initial state when no project is active
      setResumeData(initialResumeData);
      setChatHistory([]);
      setResumeHistory([]);
    }
  }, [projectId]);

  /**
   * Loads all data for a specific project
   * @param {string} id - Project ID to load data for
   */
  const loadProjectData = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);

      const projectData = ProjectStorage.getProjectData(id);

      if (projectData) {
        // Validate and sanitize loaded data
        const validResumeData =
          projectData.resumeData && typeof projectData.resumeData === "object"
            ? projectData.resumeData
            : initialResumeData;

        const validChatHistory = Array.isArray(projectData.chatHistory)
          ? projectData.chatHistory
          : [];

        const validResumeHistory =
          Array.isArray(projectData.resumeHistory) &&
          projectData.resumeHistory.length > 0
            ? projectData.resumeHistory
            : [
                {
                  snapshot: validResumeData,
                  timestamp: new Date().toISOString(),
                  message: "Initial version",
                  isLatest: true,
                },
              ];

        setResumeData(validResumeData);
        setChatHistory(validChatHistory);
        setResumeHistory(validResumeHistory);
      } else {
        // Initialize with default data if project data doesn't exist
        const defaultData = {
          resumeData: initialResumeData,
          chatHistory: [],
          resumeHistory: [
            {
              snapshot: initialResumeData,
              timestamp: new Date().toISOString(),
              message: "Initial version",
              isLatest: true,
            },
          ],
        };

        ProjectStorage.saveProjectData(id, defaultData);
        setResumeData(defaultData.resumeData);
        setChatHistory(defaultData.chatHistory);
        setResumeHistory(defaultData.resumeHistory);
      }
    } catch (err) {
      setError(`Failed to load project data: ${err.message}`);
      console.error("Error loading project data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Saves resume data for the current project
   * @param {Object} newResumeData - New resume data to save
   * @returns {Promise<boolean>} True if successful
   */
  const saveResumeData = useCallback(
    async (newResumeData) => {
      if (!projectId) return false;

      try {
        setError(null);

        const projectData = {
          resumeData: newResumeData,
          chatHistory,
          resumeHistory,
        };

        const success = ProjectStorage.saveProjectData(projectId, projectData);
        if (success) {
          setResumeData(newResumeData);
        }

        return success;
      } catch (err) {
        setError(`Failed to save resume data: ${err.message}`);
        console.error("Error saving resume data:", err);
        return false;
      }
    },
    [projectId, chatHistory, resumeHistory]
  );

  /**
   * Adds a message to the chat history
   * @param {Object} message - Chat message to add
   * @returns {Promise<boolean>} True if successful
   */
  const addChatMessage = useCallback(
    async (message) => {
      if (!projectId) return false;

      try {
        setError(null);

        const newChatHistory = [...chatHistory, message];
        const projectData = {
          resumeData,
          chatHistory: newChatHistory,
          resumeHistory,
        };

        const success = ProjectStorage.saveProjectData(projectId, projectData);
        if (success) {
          setChatHistory(newChatHistory);
        }

        return success;
      } catch (err) {
        setError(`Failed to add chat message: ${err.message}`);
        console.error("Error adding chat message:", err);
        return false;
      }
    },
    [projectId, resumeData, chatHistory, resumeHistory]
  );

  /**
   * Updates the entire chat history
   * @param {Array} newChatHistory - New chat history array
   * @returns {Promise<boolean>} True if successful
   */
  const updateChatHistory = useCallback(
    async (newChatHistory) => {
      if (!projectId) return false;

      try {
        setError(null);

        const projectData = {
          resumeData,
          chatHistory: newChatHistory,
          resumeHistory,
        };

        const success = ProjectStorage.saveProjectData(projectId, projectData);
        if (success) {
          setChatHistory(newChatHistory);
        }

        return success;
      } catch (err) {
        setError(`Failed to update chat history: ${err.message}`);
        console.error("Error updating chat history:", err);
        return false;
      }
    },
    [projectId, resumeData, resumeHistory]
  );

  /**
   * Adds a new version to resume history
   * @param {Object} snapshot - Resume data snapshot
   * @param {string} message - Description of the change
   * @returns {Promise<boolean>} True if successful
   */
  const addResumeHistoryVersion = useCallback(
    async (snapshot, message) => {
      if (!projectId) return false;

      try {
        setError(null);

        // Mark all existing versions as not latest
        const updatedHistory = resumeHistory.map((h) => ({
          ...h,
          isLatest: false,
        }));

        // Add new version as latest
        const newVersion = {
          snapshot,
          timestamp: new Date().toISOString(),
          message,
          isLatest: true,
        };

        const newResumeHistory = [...updatedHistory, newVersion];
        const projectData = {
          resumeData: snapshot,
          chatHistory,
          resumeHistory: newResumeHistory,
        };

        const success = ProjectStorage.saveProjectData(projectId, projectData);
        if (success) {
          setResumeData(snapshot);
          setResumeHistory(newResumeHistory);
        }

        return success;
      } catch (err) {
        setError(`Failed to add resume history version: ${err.message}`);
        console.error("Error adding resume history version:", err);
        return false;
      }
    },
    [projectId, chatHistory, resumeHistory]
  );

  /**
   * Applies a specific version from resume history
   * @param {string} timestamp - Timestamp of the version to apply
   * @returns {Promise<boolean>} True if successful
   */
  const applyResumeHistoryVersion = useCallback(
    async (timestamp) => {
      if (!projectId) return false;

      try {
        setError(null);

        const newResumeHistory = resumeHistory.map((h) => ({
          ...h,
          isLatest: h.timestamp === timestamp,
        }));

        const selectedVersion = newResumeHistory.find((h) => h.isLatest);
        if (!selectedVersion) {
          throw new Error("Version not found");
        }

        const projectData = {
          resumeData: selectedVersion.snapshot,
          chatHistory,
          resumeHistory: newResumeHistory,
        };

        const success = ProjectStorage.saveProjectData(projectId, projectData);
        if (success) {
          setResumeData(selectedVersion.snapshot);
          setResumeHistory(newResumeHistory);
        }

        return success;
      } catch (err) {
        setError(`Failed to apply resume history version: ${err.message}`);
        console.error("Error applying resume history version:", err);
        return false;
      }
    },
    [projectId, chatHistory, resumeHistory]
  );

  /**
   * Gets the latest chat message for preview purposes
   * @returns {string|null} Latest chat message or null
   */
  const getLatestChatMessage = useCallback(() => {
    if (chatHistory.length === 0) return null;

    const lastMessage = chatHistory[chatHistory.length - 1];
    return lastMessage.content || null;
  }, [chatHistory]);

  /**
   * Clears all data for the current project
   * @returns {Promise<boolean>} True if successful
   */
  const clearProjectData = useCallback(async () => {
    if (!projectId) return false;

    try {
      setError(null);

      const defaultData = {
        resumeData: initialResumeData,
        chatHistory: [],
        resumeHistory: [
          {
            snapshot: initialResumeData,
            timestamp: new Date().toISOString(),
            message: "Reset to initial version",
            isLatest: true,
          },
        ],
      };

      const success = ProjectStorage.saveProjectData(projectId, defaultData);
      if (success) {
        setResumeData(defaultData.resumeData);
        setChatHistory(defaultData.chatHistory);
        setResumeHistory(defaultData.resumeHistory);
      }

      return success;
    } catch (err) {
      setError(`Failed to clear project data: ${err.message}`);
      console.error("Error clearing project data:", err);
      return false;
    }
  }, [projectId]);

  return {
    // State
    resumeData,
    chatHistory,
    resumeHistory,
    isLoading,
    error,

    // Actions
    saveResumeData,
    addChatMessage,
    updateChatHistory,
    addResumeHistoryVersion,
    applyResumeHistoryVersion,
    clearProjectData,
    loadProjectData,

    // Computed
    hasData: resumeData !== initialResumeData || chatHistory.length > 0,
    latestChatMessage: getLatestChatMessage(),
    currentVersion: resumeHistory.find((h) => h.isLatest),
  };
};
