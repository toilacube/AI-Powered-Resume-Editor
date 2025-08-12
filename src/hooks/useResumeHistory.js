import { useState, useEffect, useCallback } from "react";
import { useProjectData } from "./useProjectData";

/**
 * Project-aware resume history hook
 * @param {string|null} projectId - ID of the active project
 * @returns {Object} Resume history functions and state
 */
export const useResumeHistory = (projectId = null) => {
  const {
    resumeData,
    resumeHistory,
    addResumeHistoryVersion,
    applyResumeHistoryVersion,
    isLoading,
    error,
  } = useProjectData(projectId);

  const updateResumeAndCreateHistory = useCallback(
    async (newSnapshot, userMessage) => {
      if (!projectId) return false;
      return await addResumeHistoryVersion(newSnapshot, userMessage);
    },
    [projectId, addResumeHistoryVersion]
  );

  const applyHistoryVersion = useCallback(
    async (timestampToApply) => {
      if (!projectId) return false;
      return await applyResumeHistoryVersion(timestampToApply);
    },
    [projectId, applyResumeHistoryVersion]
  );

  return {
    resumeData,
    history: resumeHistory,
    updateResumeAndCreateHistory,
    applyHistoryVersion,
    isLoading,
    error,
  };
};
