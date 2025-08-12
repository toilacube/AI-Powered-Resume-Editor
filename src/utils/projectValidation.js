/**
 * @fileoverview Data validation utilities for project data integrity
 *
 * This module provides comprehensive validation functions for project data,
 * resume data, and storage integrity checks.
 */

import {
  isValidProject,
  isValidProjectData,
  isValidProjectsIndex,
} from "../types/project.js";

/**
 * Validates resume data structure against the expected schema
 * @param {any} resumeData - Resume data to validate
 * @returns {{isValid: boolean, errors: Array<string>}} Validation result
 */
export const validateResumeData = (resumeData) => {
  const errors = [];

  if (!resumeData || typeof resumeData !== "object") {
    errors.push("Resume data must be an object");
    return { isValid: false, errors };
  }

  // Check required top-level fields
  const requiredFields = [
    "name",
    "title",
    "contact",
    "education",
    "skills",
    "experience",
    "projects",
  ];
  for (const field of requiredFields) {
    if (!(field in resumeData)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate contact information
  if (resumeData.contact) {
    if (typeof resumeData.contact !== "object") {
      errors.push("Contact must be an object");
    } else {
      const requiredContactFields = ["email", "phone", "github"];
      for (const field of requiredContactFields) {
        if (!(field in resumeData.contact)) {
          errors.push(`Missing required contact field: ${field}`);
        } else if (typeof resumeData.contact[field] !== "string") {
          errors.push(`Contact field ${field} must be a string`);
        }
      }

      // Basic email validation
      if (
        resumeData.contact.email &&
        typeof resumeData.contact.email === "string"
      ) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(resumeData.contact.email)) {
          errors.push("Invalid email format");
        }
      }
    }
  }

  // Validate education array
  if (resumeData.education) {
    if (!Array.isArray(resumeData.education)) {
      errors.push("Education must be an array");
    } else {
      resumeData.education.forEach((edu, index) => {
        if (typeof edu !== "object") {
          errors.push(`Education item ${index} must be an object`);
        } else {
          const requiredEduFields = [
            "institution",
            "degree",
            "duration",
            "details",
          ];
          for (const field of requiredEduFields) {
            if (!(field in edu)) {
              errors.push(
                `Education item ${index} missing required field: ${field}`
              );
            } else if (typeof edu[field] !== "string") {
              errors.push(
                `Education item ${index} field ${field} must be a string`
              );
            }
          }
        }
      });
    }
  }

  // Validate skills object
  if (resumeData.skills) {
    if (typeof resumeData.skills !== "object") {
      errors.push("Skills must be an object");
    } else {
      const requiredSkillFields = [
        "languages",
        "frameworks",
        "databases",
        "sourceManagement",
        "english",
        "others",
      ];
      for (const field of requiredSkillFields) {
        if (!(field in resumeData.skills)) {
          errors.push(`Missing required skills field: ${field}`);
        } else if (typeof resumeData.skills[field] !== "string") {
          errors.push(`Skills field ${field} must be a string`);
        }
      }
    }
  }

  // Validate experience array
  if (resumeData.experience) {
    if (!Array.isArray(resumeData.experience)) {
      errors.push("Experience must be an array");
    } else {
      resumeData.experience.forEach((exp, index) => {
        if (typeof exp !== "object") {
          errors.push(`Experience item ${index} must be an object`);
        } else {
          const requiredExpFields = [
            "role",
            "company",
            "duration",
            "responsibilities",
            "techStack",
          ];
          for (const field of requiredExpFields) {
            if (!(field in exp)) {
              errors.push(
                `Experience item ${index} missing required field: ${field}`
              );
            } else if (field === "responsibilities") {
              if (!Array.isArray(exp[field])) {
                errors.push(
                  `Experience item ${index} responsibilities must be an array`
                );
              } else if (!exp[field].every((r) => typeof r === "string")) {
                errors.push(
                  `Experience item ${index} responsibilities must be array of strings`
                );
              }
            } else if (typeof exp[field] !== "string") {
              errors.push(
                `Experience item ${index} field ${field} must be a string`
              );
            }
          }
        }
      });
    }
  }

  // Validate projects array
  if (resumeData.projects) {
    if (!Array.isArray(resumeData.projects)) {
      errors.push("Projects must be an array");
    } else {
      resumeData.projects.forEach((project, index) => {
        if (typeof project !== "object") {
          errors.push(`Project item ${index} must be an object`);
        } else {
          const requiredProjectFields = [
            "name",
            "isPersonal",
            "responsibilities",
            "techStack",
          ];
          for (const field of requiredProjectFields) {
            if (!(field in project)) {
              errors.push(
                `Project item ${index} missing required field: ${field}`
              );
            } else if (field === "isPersonal") {
              if (typeof project[field] !== "boolean") {
                errors.push(
                  `Project item ${index} isPersonal must be a boolean`
                );
              }
            } else if (field === "responsibilities") {
              if (!Array.isArray(project[field])) {
                errors.push(
                  `Project item ${index} responsibilities must be an array`
                );
              } else if (!project[field].every((r) => typeof r === "string")) {
                errors.push(
                  `Project item ${index} responsibilities must be array of strings`
                );
              }
            } else if (typeof project[field] !== "string") {
              errors.push(
                `Project item ${index} field ${field} must be a string`
              );
            }
          }
        }
      });
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates chat history structure
 * @param {any} chatHistory - Chat history to validate
 * @returns {{isValid: boolean, errors: Array<string>}} Validation result
 */
export const validateChatHistory = (chatHistory) => {
  const errors = [];

  if (!Array.isArray(chatHistory)) {
    errors.push("Chat history must be an array");
    return { isValid: false, errors };
  }

  chatHistory.forEach((message, index) => {
    if (typeof message !== "object") {
      errors.push(`Chat message ${index} must be an object`);
    } else {
      if (!("role" in message)) {
        errors.push(`Chat message ${index} missing required field: role`);
      } else if (typeof message.role !== "string") {
        errors.push(`Chat message ${index} role must be a string`);
      } else if (!["user", "assistant", "system"].includes(message.role)) {
        errors.push(
          `Chat message ${index} role must be 'user', 'assistant', or 'system'`
        );
      }

      if (!("content" in message)) {
        errors.push(`Chat message ${index} missing required field: content`);
      } else if (typeof message.content !== "string") {
        errors.push(`Chat message ${index} content must be a string`);
      }

      // Optional timestamp validation
      if ("timestamp" in message && typeof message.timestamp !== "string") {
        errors.push(`Chat message ${index} timestamp must be a string`);
      }
    }
  });

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates resume history structure
 * @param {any} resumeHistory - Resume history to validate
 * @returns {{isValid: boolean, errors: Array<string>}} Validation result
 */
export const validateResumeHistory = (resumeHistory) => {
  const errors = [];

  if (!Array.isArray(resumeHistory)) {
    errors.push("Resume history must be an array");
    return { isValid: false, errors };
  }

  let hasLatest = false;
  resumeHistory.forEach((entry, index) => {
    if (typeof entry !== "object") {
      errors.push(`Resume history entry ${index} must be an object`);
    } else {
      const requiredFields = ["snapshot", "timestamp", "message", "isLatest"];
      for (const field of requiredFields) {
        if (!(field in entry)) {
          errors.push(
            `Resume history entry ${index} missing required field: ${field}`
          );
        } else if (field === "snapshot") {
          if (typeof entry[field] !== "object") {
            errors.push(
              `Resume history entry ${index} snapshot must be an object`
            );
          }
        } else if (field === "isLatest") {
          if (typeof entry[field] !== "boolean") {
            errors.push(
              `Resume history entry ${index} isLatest must be a boolean`
            );
          } else if (entry[field]) {
            if (hasLatest) {
              errors.push(`Multiple resume history entries marked as latest`);
            }
            hasLatest = true;
          }
        } else if (typeof entry[field] !== "string") {
          errors.push(
            `Resume history entry ${index} field ${field} must be a string`
          );
        }
      }

      // Validate timestamp format
      if (entry.timestamp && typeof entry.timestamp === "string") {
        const date = new Date(entry.timestamp);
        if (isNaN(date.getTime())) {
          errors.push(
            `Resume history entry ${index} has invalid timestamp format`
          );
        }
      }
    }
  });

  // Check that at least one entry is marked as latest (if history exists)
  if (resumeHistory.length > 0 && !hasLatest) {
    errors.push("Resume history must have at least one entry marked as latest");
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates complete project data structure
 * @param {any} projectData - Project data to validate
 * @returns {{isValid: boolean, errors: Array<string>}} Validation result
 */
export const validateCompleteProjectData = (projectData) => {
  const errors = [];

  // Basic structure validation
  const basicValidation = isValidProjectData(projectData);
  if (!basicValidation) {
    errors.push("Invalid project data structure");
    return { isValid: false, errors };
  }

  // Validate resume data
  const resumeValidation = validateResumeData(projectData.resumeData);
  if (!resumeValidation.isValid) {
    errors.push(...resumeValidation.errors.map((e) => `Resume data: ${e}`));
  }

  // Validate chat history
  const chatValidation = validateChatHistory(projectData.chatHistory);
  if (!chatValidation.isValid) {
    errors.push(...chatValidation.errors.map((e) => `Chat history: ${e}`));
  }

  // Validate resume history
  const historyValidation = validateResumeHistory(projectData.resumeHistory);
  if (!historyValidation.isValid) {
    errors.push(...historyValidation.errors.map((e) => `Resume history: ${e}`));
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates project name
 * @param {string} name - Project name to validate
 * @returns {{isValid: boolean, errors: Array<string>}} Validation result
 */
export const validateProjectName = (name) => {
  const errors = [];

  if (typeof name !== "string") {
    errors.push("Project name must be a string");
    return { isValid: false, errors };
  }

  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    errors.push("Project name cannot be empty");
  }

  if (trimmedName.length > 100) {
    errors.push("Project name cannot exceed 100 characters");
  }

  // Check for invalid characters (basic validation)
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(trimmedName)) {
    errors.push("Project name contains invalid characters");
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validates storage integrity by checking all projects and their data
 * @returns {{isValid: boolean, errors: Array<string>, warnings: Array<string>}} Validation result
 */
export const validateStorageIntegrity = () => {
  const errors = [];
  const warnings = [];

  try {
    // Get projects index
    const indexData = localStorage.getItem("projects_index");
    if (!indexData) {
      warnings.push("No projects index found");
      return { isValid: true, errors, warnings };
    }

    let index;
    try {
      index = JSON.parse(indexData);
    } catch (error) {
      errors.push("Projects index is not valid JSON");
      return { isValid: false, errors, warnings };
    }

    // Validate index structure
    if (!isValidProjectsIndex(index)) {
      errors.push("Projects index has invalid structure");
      return { isValid: false, errors, warnings };
    }

    // Validate each project
    index.projects.forEach((project, projectIndex) => {
      if (!isValidProject(project)) {
        errors.push(`Project ${projectIndex} has invalid structure`);
        return;
      }

      // Check if project data exists
      const resumeKey = `resume_${project.id}`;
      const chatKey = `chat_history_${project.id}`;
      const historyKey = `resume_history_${project.id}`;

      if (!localStorage.getItem(resumeKey)) {
        warnings.push(
          `Project ${project.name} (${project.id}) missing resume data`
        );
      }

      if (!localStorage.getItem(chatKey)) {
        warnings.push(
          `Project ${project.name} (${project.id}) missing chat history`
        );
      }

      if (!localStorage.getItem(historyKey)) {
        warnings.push(
          `Project ${project.name} (${project.id}) missing resume history`
        );
      }

      // Validate project data if it exists
      try {
        const resumeData = localStorage.getItem(resumeKey);
        if (resumeData) {
          const parsed = JSON.parse(resumeData);
          const validation = validateResumeData(parsed);
          if (!validation.isValid) {
            errors.push(
              `Project ${
                project.name
              } has invalid resume data: ${validation.errors.join(", ")}`
            );
          }
        }
      } catch (error) {
        errors.push(`Project ${project.name} resume data is not valid JSON`);
      }

      try {
        const chatData = localStorage.getItem(chatKey);
        if (chatData) {
          const parsed = JSON.parse(chatData);
          const validation = validateChatHistory(parsed);
          if (!validation.isValid) {
            errors.push(
              `Project ${
                project.name
              } has invalid chat history: ${validation.errors.join(", ")}`
            );
          }
        }
      } catch (error) {
        errors.push(`Project ${project.name} chat history is not valid JSON`);
      }

      try {
        const historyData = localStorage.getItem(historyKey);
        if (historyData) {
          const parsed = JSON.parse(historyData);
          const validation = validateResumeHistory(parsed);
          if (!validation.isValid) {
            errors.push(
              `Project ${
                project.name
              } has invalid resume history: ${validation.errors.join(", ")}`
            );
          }
        }
      } catch (error) {
        errors.push(`Project ${project.name} resume history is not valid JSON`);
      }
    });

    // Check for orphaned data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith("resume_") ||
          key.startsWith("chat_history_") ||
          key.startsWith("resume_history_"))
      ) {
        const projectId = key.split("_").slice(1).join("_");
        const projectExists = index.projects.some((p) => p.id === projectId);
        if (!projectExists) {
          warnings.push(`Orphaned data found: ${key}`);
        }
      }
    }

    // Validate active project
    if (index.activeProjectId) {
      const activeProject = index.projects.find(
        (p) => p.id === index.activeProjectId
      );
      if (!activeProject) {
        errors.push(
          "Active project ID does not correspond to any existing project"
        );
      }
    }
  } catch (error) {
    errors.push(`Storage integrity check failed: ${error.message}`);
  }

  return { isValid: errors.length === 0, errors, warnings };
};
