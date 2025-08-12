/**
 * @fileoverview Context menu component for project actions
 *
 * This component provides a right-click context menu for project operations
 * like rename and delete, with proper positioning and click-outside handling.
 */

import React, { useState, useEffect, useRef } from "react";
import { Edit2, Trash2, X, Check } from "lucide-react";

/**
 * ProjectContextMenu component for project actions
 * @param {Object} props - Component props
 * @param {string} props.projectId - ID of the project for context menu
 * @param {number} props.x - X coordinate for menu positioning
 * @param {number} props.y - Y coordinate for menu positioning
 * @param {Function} props.onClose - Function called to close the menu
 * @param {Function} props.onRename - Function called to rename project
 * @param {Function} props.onDelete - Function called to delete project
 * @param {Array} props.projects - List of all projects (for validation)
 */
const ProjectContextMenu = ({
  projectId,
  x,
  y,
  onClose,
  onRename,
  onDelete,
  projects = [],
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [renameError, setRenameError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const project = projects.find((p) => p.id === projectId);

  // Set initial name when entering rename mode
  useEffect(() => {
    if (isRenaming && project) {
      setNewName(project.name);
      setRenameError("");
    }
  }, [isRenaming, project]);

  // Focus input when entering rename mode
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (isRenaming) {
          handleCancelRename();
        } else if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, isRenaming, showDeleteConfirm]);

  // Position menu within viewport bounds
  const getMenuStyle = () => {
    const menuWidth = 200;
    const menuHeight = isRenaming ? 120 : showDeleteConfirm ? 100 : 80;

    let adjustedX = x;
    let adjustedY = y;

    // Adjust horizontal position if menu would go off-screen
    if (x + menuWidth > window.innerWidth) {
      adjustedX = window.innerWidth - menuWidth - 10;
    }

    // Adjust vertical position if menu would go off-screen
    if (y + menuHeight > window.innerHeight) {
      adjustedY = window.innerHeight - menuHeight - 10;
    }

    return {
      position: "fixed",
      left: `${adjustedX}px`,
      top: `${adjustedY}px`,
      zIndex: 1000,
    };
  };

  /**
   * Handles rename action initiation
   */
  const handleRenameClick = () => {
    setIsRenaming(true);
    setShowDeleteConfirm(false);
  };

  /**
   * Handles rename form submission
   */
  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    setRenameError("");

    const trimmedName = newName.trim();

    if (!trimmedName) {
      setRenameError("Project name is required");
      return;
    }

    if (trimmedName === project.name) {
      // No change, just close
      handleCancelRename();
      return;
    }

    // Check for duplicate names
    const existingProject = projects.find(
      (p) =>
        p.id !== projectId && p.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existingProject) {
      setRenameError("A project with this name already exists");
      return;
    }

    try {
      const success = await onRename(projectId, trimmedName);
      if (success) {
        onClose();
      } else {
        setRenameError("Failed to rename project");
      }
    } catch (error) {
      setRenameError(error.message || "Failed to rename project");
    }
  };

  /**
   * Cancels rename operation
   */
  const handleCancelRename = () => {
    setIsRenaming(false);
    setNewName("");
    setRenameError("");
  };

  /**
   * Handles delete action initiation
   */
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setIsRenaming(false);
  };

  /**
   * Handles delete confirmation
   */
  const handleDeleteConfirm = async () => {
    try {
      const success = await onDelete(projectId);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  /**
   * Cancels delete operation
   */
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (!project) {
    return null;
  }

  return (
    <div ref={menuRef} className="project-context-menu" style={getMenuStyle()}>
      {isRenaming ? (
        // Rename form
        <div className="context-menu-rename">
          <form onSubmit={handleRenameSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="rename-input"
              placeholder="Project name"
              maxLength={50}
            />
            {renameError && <div className="rename-error">{renameError}</div>}
            <div className="rename-actions">
              <button type="submit" className="btn-confirm">
                <Check size={14} />
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancelRename}
              >
                <X size={14} />
              </button>
            </div>
          </form>
        </div>
      ) : showDeleteConfirm ? (
        // Delete confirmation
        <div className="context-menu-delete-confirm">
          <div className="delete-message">Delete "{project.name}"?</div>
          <div className="delete-warning">This action cannot be undone.</div>
          <div className="delete-actions">
            <button
              className="btn-delete-confirm"
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
            <button className="btn-delete-cancel" onClick={handleDeleteCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // Main menu
        <div className="context-menu-items">
          <button className="context-menu-item" onClick={handleRenameClick}>
            <Edit2 size={16} />
            <span>Rename</span>
          </button>
          <button
            className="context-menu-item delete"
            onClick={handleDeleteClick}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectContextMenu;
