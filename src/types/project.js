/**
 * @fileoverview Project data models and TypeScript-style interfaces for multi-project management
 *
 * This file defines the data structures used for managing multiple resume projects.
 * While the project uses JavaScript, these JSDoc type definitions provide TypeScript-like
 * type safety and documentation.
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique identifier for the project
 * @property {string} name - Display name of the project
 * @property {string} createdAt - ISO timestamp when project was created
 * @property {string} updatedAt - ISO timestamp when project was last modified
 * @property {string} [lastChatMessage] - Preview of the latest chat message
 */

/**
 * @typedef {Object} ProjectData
 * @property {Object} resumeData - Resume data specific to this project
 * @property {Array<Object>} chatHistory - Chat messages for this project
 * @property {Array<Object>} resumeHistory - Resume version history for this project
 */

/**
 * @typedef {Object} ProjectsIndex
 * @property {Array<Project>} projects - List of all projects
 * @property {string|null} activeProjectId - ID of the currently active project
 */

/**
 * @typedef {Object} MigrationResult
 * @property {boolean} success - Whether migration completed successfully
 * @property {string} [defaultProjectId] - ID of the default project created during migration
 * @property {Array<string>} [errors] - List of errors encountered during migration
 */

/**
 * @typedef {Object} StorageKeys
 * @property {string} PROJECTS_INDEX - Key for storing projects index
 * @property {string} RESUME_DATA_PREFIX - Prefix for project-specific resume data keys
 * @property {string} CHAT_HISTORY_PREFIX - Prefix for project-specific chat history keys
 * @property {string} RESUME_HISTORY_PREFIX - Prefix for project-specific resume history keys
 * @property {string} LEGACY_RESUME_DATA - Legacy key for single-project resume data
 * @property {string} LEGACY_RESUME_HISTORY - Legacy key for single-project resume history
 */

// Storage key constants
export const STORAGE_KEYS = {
  PROJECTS_INDEX: "projects_index",
  RESUME_DATA_PREFIX: "resume_",
  CHAT_HISTORY_PREFIX: "chat_history_",
  RESUME_HISTORY_PREFIX: "resume_history_",
  LEGACY_RESUME_DATA: "resumeData",
  LEGACY_RESUME_HISTORY: "resumeHistory",
};

/**
 * Generates a unique project ID
 * @returns {string} Unique project identifier
 */
export const generateProjectId = () => {
  return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Creates a new project object with default values
 * @param {string} name - Name of the project
 * @param {string} [id] - Optional custom ID, generates one if not provided
 * @returns {Project} New project object
 */
export const createProject = (name, id = null) => {
  const now = new Date().toISOString();
  return {
    id: id || generateProjectId(),
    name: name.trim(),
    createdAt: now,
    updatedAt: now,
    lastChatMessage: undefined,
  };
};

/**
 * Creates default project data structure
 * @param {Object} [resumeData] - Initial resume data, uses default if not provided
 * @returns {ProjectData} Default project data structure
 */
export const createDefaultProjectData = (resumeData = null) => {
  return {
    resumeData: resumeData || {},
    chatHistory: [],
    resumeHistory: [],
  };
};

/**
 * Validates a project object structure
 * @param {any} project - Object to validate
 * @returns {boolean} True if valid project structure
 */
export const isValidProject = (project) => {
  if (!project || typeof project !== "object") {
    return false;
  }

  return (
    typeof project.id === "string" &&
    typeof project.name === "string" &&
    typeof project.createdAt === "string" &&
    typeof project.updatedAt === "string" &&
    project.id.length > 0 &&
    project.name.length > 0
  );
};

/**
 * Validates project data structure
 * @param {any} projectData - Object to validate
 * @returns {boolean} True if valid project data structure
 */
export const isValidProjectData = (projectData) => {
  if (!projectData || typeof projectData !== "object") {
    return false;
  }

  return (
    typeof projectData.resumeData === "object" &&
    Array.isArray(projectData.chatHistory) &&
    Array.isArray(projectData.resumeHistory)
  );
};

/**
 * Validates projects index structure
 * @param {any} index - Object to validate
 * @returns {boolean} True if valid projects index structure
 */
export const isValidProjectsIndex = (index) => {
  if (!index || typeof index !== "object") {
    return false;
  }

  return (
    Array.isArray(index.projects) &&
    (index.activeProjectId === null ||
      typeof index.activeProjectId === "string") &&
    index.projects.every(isValidProject)
  );
};
