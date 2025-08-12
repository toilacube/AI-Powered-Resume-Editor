/**
 * @fileoverview Storage utilities for multi-project management
 *
 * This module provides utilities for managing project-specific data in localStorage,
 * including CRUD operations, data validation, and migration from legacy storage.
 */

import {
  STORAGE_KEYS,
  createProject,
  createDefaultProjectData,
  isValidProject,
  isValidProjectData,
  isValidProjectsIndex,
  generateProjectId,
} from "../types/project.js";
import initialResumeData from "../data/resumeData.json";

/**
 * Storage utility class for managing project data in localStorage
 */
export class ProjectStorage {
  /**
   * Gets the projects index from localStorage
   * @returns {import('../types/project.js').ProjectsIndex|null} Projects index or null if not found
   */
  static getProjectsIndex() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS_INDEX);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return isValidProjectsIndex(parsed) ? parsed : null;
    } catch (error) {
      console.error("Error reading projects index:", error);
      return null;
    }
  }

  /**
   * Saves the projects index to localStorage
   * @param {import('../types/project.js').ProjectsIndex} index - Projects index to save
   * @returns {boolean} True if saved successfully
   */
  static saveProjectsIndex(index) {
    try {
      if (!isValidProjectsIndex(index)) {
        throw new Error("Invalid projects index structure");
      }

      localStorage.setItem(STORAGE_KEYS.PROJECTS_INDEX, JSON.stringify(index));
      return true;
    } catch (error) {
      console.error("Error saving projects index:", error);
      return false;
    }
  }

  /**
   * Gets project-specific data from localStorage
   * @param {string} projectId - ID of the project
   * @returns {import('../types/project.js').ProjectData|null} Project data or null if not found
   */
  static getProjectData(projectId) {
    try {
      const resumeKey = `${STORAGE_KEYS.RESUME_DATA_PREFIX}${projectId}`;
      const chatKey = `${STORAGE_KEYS.CHAT_HISTORY_PREFIX}${projectId}`;
      const historyKey = `${STORAGE_KEYS.RESUME_HISTORY_PREFIX}${projectId}`;

      const resumeData = localStorage.getItem(resumeKey);
      const chatHistory = localStorage.getItem(chatKey);
      const resumeHistory = localStorage.getItem(historyKey);

      const projectData = {
        resumeData: resumeData ? JSON.parse(resumeData) : {},
        chatHistory: chatHistory ? JSON.parse(chatHistory) : [],
        resumeHistory: resumeHistory ? JSON.parse(resumeHistory) : [],
      };

      return isValidProjectData(projectData) ? projectData : null;
    } catch (error) {
      console.error(`Error reading project data for ${projectId}:`, error);
      return null;
    }
  }

  /**
   * Saves project-specific data to localStorage
   * @param {string} projectId - ID of the project
   * @param {import('../types/project.js').ProjectData} projectData - Data to save
   * @returns {boolean} True if saved successfully
   */
  static saveProjectData(projectId, projectData) {
    try {
      if (!isValidProjectData(projectData)) {
        throw new Error("Invalid project data structure");
      }

      const resumeKey = `${STORAGE_KEYS.RESUME_DATA_PREFIX}${projectId}`;
      const chatKey = `${STORAGE_KEYS.CHAT_HISTORY_PREFIX}${projectId}`;
      const historyKey = `${STORAGE_KEYS.RESUME_HISTORY_PREFIX}${projectId}`;

      localStorage.setItem(resumeKey, JSON.stringify(projectData.resumeData));
      localStorage.setItem(chatKey, JSON.stringify(projectData.chatHistory));
      localStorage.setItem(
        historyKey,
        JSON.stringify(projectData.resumeHistory)
      );

      return true;
    } catch (error) {
      console.error(`Error saving project data for ${projectId}:`, error);
      return false;
    }
  }

  /**
   * Deletes all data associated with a project
   * @param {string} projectId - ID of the project to delete
   * @returns {boolean} True if deleted successfully
   */
  static deleteProjectData(projectId) {
    try {
      const resumeKey = `${STORAGE_KEYS.RESUME_DATA_PREFIX}${projectId}`;
      const chatKey = `${STORAGE_KEYS.CHAT_HISTORY_PREFIX}${projectId}`;
      const historyKey = `${STORAGE_KEYS.RESUME_HISTORY_PREFIX}${projectId}`;

      localStorage.removeItem(resumeKey);
      localStorage.removeItem(chatKey);
      localStorage.removeItem(historyKey);

      return true;
    } catch (error) {
      console.error(`Error deleting project data for ${projectId}:`, error);
      return false;
    }
  }

  /**
   * Creates a new project with default data
   * @param {string} name - Name of the project
   * @param {Object} [initialData] - Optional initial resume data
   * @returns {import('../types/project.js').Project|null} Created project or null if failed
   */
  static createProject(name, initialData = null) {
    try {
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        throw new Error("Project name is required");
      }

      const project = createProject(name);
      const projectData = createDefaultProjectData(
        initialData || initialResumeData
      );

      // Save project data
      if (!this.saveProjectData(project.id, projectData)) {
        throw new Error("Failed to save project data");
      }

      // Update projects index
      let index = this.getProjectsIndex() || {
        projects: [],
        activeProjectId: null,
      };
      index.projects.push(project);

      // Set as active if it's the first project
      if (index.projects.length === 1) {
        index.activeProjectId = project.id;
      }

      if (!this.saveProjectsIndex(index)) {
        // Rollback project data if index save fails
        this.deleteProjectData(project.id);
        throw new Error("Failed to save projects index");
      }

      return project;
    } catch (error) {
      console.error("Error creating project:", error);
      return null;
    }
  }

  /**
   * Updates a project's metadata
   * @param {string} projectId - ID of the project to update
   * @param {Partial<import('../types/project.js').Project>} updates - Updates to apply
   * @returns {boolean} True if updated successfully
   */
  static updateProject(projectId, updates) {
    try {
      const index = this.getProjectsIndex();
      if (!index) return false;

      const projectIndex = index.projects.findIndex((p) => p.id === projectId);
      if (projectIndex === -1) return false;

      const updatedProject = {
        ...index.projects[projectIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      if (!isValidProject(updatedProject)) {
        throw new Error("Invalid project data after update");
      }

      index.projects[projectIndex] = updatedProject;
      return this.saveProjectsIndex(index);
    } catch (error) {
      console.error(`Error updating project ${projectId}:`, error);
      return false;
    }
  }

  /**
   * Deletes a project and all its data
   * @param {string} projectId - ID of the project to delete
   * @returns {boolean} True if deleted successfully
   */
  static deleteProject(projectId) {
    try {
      const index = this.getProjectsIndex();
      if (!index) return false;

      const projectIndex = index.projects.findIndex((p) => p.id === projectId);
      if (projectIndex === -1) return false;

      // Delete project data
      if (!this.deleteProjectData(projectId)) {
        console.warn(`Failed to delete data for project ${projectId}`);
      }

      // Remove from index
      index.projects.splice(projectIndex, 1);

      // Update active project if necessary
      if (index.activeProjectId === projectId) {
        index.activeProjectId =
          index.projects.length > 0 ? index.projects[0].id : null;
      }

      return this.saveProjectsIndex(index);
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
      return false;
    }
  }

  /**
   * Sets the active project
   * @param {string} projectId - ID of the project to set as active
   * @returns {boolean} True if set successfully
   */
  static setActiveProject(projectId) {
    try {
      const index = this.getProjectsIndex();
      if (!index) return false;

      const project = index.projects.find((p) => p.id === projectId);
      if (!project) return false;

      index.activeProjectId = projectId;
      return this.saveProjectsIndex(index);
    } catch (error) {
      console.error(`Error setting active project ${projectId}:`, error);
      return false;
    }
  }

  /**
   * Gets the currently active project
   * @returns {import('../types/project.js').Project|null} Active project or null
   */
  static getActiveProject() {
    try {
      const index = this.getProjectsIndex();
      if (!index || !index.activeProjectId) return null;

      const activeProject = index.projects.find(
        (p) => p.id === index.activeProjectId
      );

      // If active project doesn't exist, fallback to first project
      if (!activeProject && index.projects.length > 0) {
        this.setActiveProject(index.projects[0].id);
        return index.projects[0];
      }

      return activeProject || null;
    } catch (error) {
      console.error("Error getting active project:", error);
      return null;
    }
  }

  /**
   * Gets all projects
   * @returns {Array<import('../types/project.js').Project>} List of all projects
   */
  static getAllProjects() {
    try {
      const index = this.getProjectsIndex();
      return index ? index.projects : [];
    } catch (error) {
      console.error("Error getting all projects:", error);
      return [];
    }
  }

  /**
   * Checks if legacy data exists (for migration purposes)
   * @returns {boolean} True if legacy data exists
   */
  static hasLegacyData() {
    return (
      localStorage.getItem(STORAGE_KEYS.LEGACY_RESUME_DATA) !== null ||
      localStorage.getItem(STORAGE_KEYS.LEGACY_RESUME_HISTORY) !== null
    );
  }

  /**
   * Migrates legacy single-project data to multi-project structure
   * @returns {import('../types/project.js').MigrationResult} Migration result
   */
  static migrateLegacyData() {
    try {
      if (!this.hasLegacyData()) {
        return { success: true, errors: ["No legacy data found"] };
      }

      // Check if projects already exist
      const existingIndex = this.getProjectsIndex();
      if (existingIndex && existingIndex.projects.length > 0) {
        return {
          success: true,
          errors: ["Projects already exist, skipping migration"],
        };
      }

      const errors = [];
      let resumeData = null;
      let resumeHistory = null;

      // Get legacy data
      try {
        const legacyResumeData = localStorage.getItem(
          STORAGE_KEYS.LEGACY_RESUME_DATA
        );
        if (legacyResumeData) {
          resumeData = JSON.parse(legacyResumeData);
        }
      } catch (error) {
        errors.push(`Failed to parse legacy resume data: ${error.message}`);
      }

      try {
        const legacyResumeHistory = localStorage.getItem(
          STORAGE_KEYS.LEGACY_RESUME_HISTORY
        );
        if (legacyResumeHistory) {
          resumeHistory = JSON.parse(legacyResumeHistory);
        }
      } catch (error) {
        errors.push(`Failed to parse legacy resume history: ${error.message}`);
      }

      // Create default project with legacy data
      const defaultProject = this.createProject(
        "My Resume",
        resumeData || initialResumeData
      );

      if (!defaultProject) {
        errors.push("Failed to create default project");
        return { success: false, errors };
      }

      // Update project data with legacy history if available
      if (resumeHistory && Array.isArray(resumeHistory)) {
        const projectData = this.getProjectData(defaultProject.id);
        if (projectData) {
          projectData.resumeHistory = resumeHistory;
          this.saveProjectData(defaultProject.id, projectData);
        }
      }

      // Clean up legacy data
      try {
        localStorage.removeItem(STORAGE_KEYS.LEGACY_RESUME_DATA);
        localStorage.removeItem(STORAGE_KEYS.LEGACY_RESUME_HISTORY);
      } catch (error) {
        errors.push(`Failed to clean up legacy data: ${error.message}`);
      }

      return {
        success: true,
        defaultProjectId: defaultProject.id,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      console.error("Error during migration:", error);
      return {
        success: false,
        errors: [`Migration failed: ${error.message}`],
      };
    }
  }

  /**
   * Clears all project data (for testing/reset purposes)
   * @returns {boolean} True if cleared successfully
   */
  static clearAllData() {
    try {
      const index = this.getProjectsIndex();
      if (index) {
        // Delete all project data
        index.projects.forEach((project) => {
          this.deleteProjectData(project.id);
        });
      }

      // Remove projects index
      localStorage.removeItem(STORAGE_KEYS.PROJECTS_INDEX);

      return true;
    } catch (error) {
      console.error("Error clearing all data:", error);
      return false;
    }
  }
}
