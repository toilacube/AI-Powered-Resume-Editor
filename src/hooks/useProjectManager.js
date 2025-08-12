/**
 * @fileoverview Project management hook for CRUD operations on projects
 *
 * This hook provides functionality to create, read, update, and delete projects,
 * as well as manage the active project state.
 */

import { useState, useEffect, useCallback } from "react";
import { ProjectStorage } from "../utils/projectStorage.js";

/**
 * Hook for managing projects with CRUD operations
 * @returns {Object} Project management functions and state
 */
export const useProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load projects on mount and handle first-time users
  useEffect(() => {
    loadProjects();
  }, []);

  // Handle first-time user experience
  useEffect(() => {
    if (!isLoading && projects.length === 0 && !error) {
      // Create a default project for first-time users
      createProject("My Resume").then((projectId) => {
        if (projectId) {
          console.log("Created default project for first-time user");
        }
      });
    }
  }, [isLoading, projects.length, error]);

  /**
   * Loads all projects from storage
   */
  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check for migration first
      if (ProjectStorage.hasLegacyData()) {
        const migrationResult = ProjectStorage.migrateLegacyData();
        if (!migrationResult.success) {
          console.warn("Migration failed:", migrationResult.errors);
        }
      }

      const allProjects = ProjectStorage.getAllProjects();
      const activeProject = ProjectStorage.getActiveProject();

      setProjects(allProjects);
      setActiveProjectId(activeProject?.id || null);

      // If no active project but projects exist, set first as active
      if (!activeProject && allProjects.length > 0) {
        ProjectStorage.setActiveProject(allProjects[0].id);
        setActiveProjectId(allProjects[0].id);
      }
    } catch (err) {
      setError(`Failed to load projects: ${err.message}`);
      console.error("Error loading projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Creates a new project
   * @param {string} name - Name of the project
   * @param {Object} [initialData] - Optional initial resume data
   * @returns {Promise<string|null>} Project ID if successful, null if failed
   */
  const createProject = useCallback(
    async (name, initialData = null) => {
      try {
        setError(null);

        if (!name || typeof name !== "string" || name.trim().length === 0) {
          throw new Error("Project name is required");
        }

        // Check for duplicate names
        const existingProject = projects.find(
          (p) => p.name.toLowerCase() === name.trim().toLowerCase()
        );
        if (existingProject) {
          throw new Error("A project with this name already exists");
        }

        const newProject = ProjectStorage.createProject(
          name.trim(),
          initialData
        );
        if (!newProject) {
          throw new Error("Failed to create project");
        }

        // Reload projects to get updated state
        await loadProjects();

        return newProject.id;
      } catch (err) {
        setError(err.message);
        console.error("Error creating project:", err);
        return null;
      }
    },
    [projects, loadProjects]
  );

  /**
   * Renames an existing project
   * @param {string} projectId - ID of the project to rename
   * @param {string} newName - New name for the project
   * @returns {Promise<boolean>} True if successful
   */
  const renameProject = useCallback(
    async (projectId, newName) => {
      try {
        setError(null);

        if (
          !newName ||
          typeof newName !== "string" ||
          newName.trim().length === 0
        ) {
          throw new Error("Project name is required");
        }

        // Check for duplicate names (excluding current project)
        const existingProject = projects.find(
          (p) =>
            p.id !== projectId &&
            p.name.toLowerCase() === newName.trim().toLowerCase()
        );
        if (existingProject) {
          throw new Error("A project with this name already exists");
        }

        const success = ProjectStorage.updateProject(projectId, {
          name: newName.trim(),
        });
        if (!success) {
          throw new Error("Failed to rename project");
        }

        // Reload projects to get updated state
        await loadProjects();

        return true;
      } catch (err) {
        setError(err.message);
        console.error("Error renaming project:", err);
        return false;
      }
    },
    [projects, loadProjects]
  );

  /**
   * Deletes a project and all its data
   * @param {string} projectId - ID of the project to delete
   * @returns {Promise<boolean>} True if successful
   */
  const deleteProject = useCallback(
    async (projectId) => {
      try {
        setError(null);

        const success = ProjectStorage.deleteProject(projectId);
        if (!success) {
          throw new Error("Failed to delete project");
        }

        // Reload projects to get updated state
        await loadProjects();

        return true;
      } catch (err) {
        setError(err.message);
        console.error("Error deleting project:", err);
        return false;
      }
    },
    [loadProjects]
  );

  /**
   * Switches to a different project
   * @param {string} projectId - ID of the project to switch to
   * @returns {Promise<boolean>} True if successful
   */
  const switchProject = useCallback(
    async (projectId) => {
      try {
        setError(null);

        const project = projects.find((p) => p.id === projectId);
        if (!project) {
          throw new Error("Project not found");
        }

        const success = ProjectStorage.setActiveProject(projectId);
        if (!success) {
          throw new Error("Failed to switch project");
        }

        setActiveProjectId(projectId);
        return true;
      } catch (err) {
        setError(err.message);
        console.error("Error switching project:", err);
        return false;
      }
    },
    [projects]
  );

  /**
   * Gets the currently active project
   * @returns {Object|null} Active project or null
   */
  const getActiveProject = useCallback(() => {
    return projects.find((p) => p.id === activeProjectId) || null;
  }, [projects, activeProjectId]);

  /**
   * Updates the last chat message preview for a project
   * @param {string} projectId - ID of the project
   * @param {string} message - Last chat message
   * @returns {Promise<boolean>} True if successful
   */
  const updateLastChatMessage = useCallback(async (projectId, message) => {
    try {
      const success = ProjectStorage.updateProject(projectId, {
        lastChatMessage: message?.substring(0, 100) || undefined,
      });

      if (success) {
        // Update local state without full reload for better performance
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  lastChatMessage: message?.substring(0, 100) || undefined,
                }
              : p
          )
        );
      }

      return success;
    } catch (err) {
      console.error("Error updating last chat message:", err);
      return false;
    }
  }, []);

  return {
    // State
    projects,
    activeProjectId,
    isLoading,
    error,

    // Actions
    createProject,
    renameProject,
    deleteProject,
    switchProject,
    loadProjects,
    getActiveProject,
    updateLastChatMessage,

    // Computed
    hasProjects: projects.length > 0,
    activeProject: getActiveProject(),
  };
};
