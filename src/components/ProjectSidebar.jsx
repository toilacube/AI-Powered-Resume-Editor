/**
 * @fileoverview Project sidebar component for project navigation
 *
 * This component provides a collapsible sidebar for viewing and managing projects,
 * including project list, creation, and navigation functionality.
 */

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  FolderOpen,
  MessageSquare,
  Folder,
} from "lucide-react";
import ProjectListItem from "./ProjectListItem";
import ProjectContextMenu from "./ProjectContextMenu";

/**
 * ProjectSidebar component for project navigation and management
 * @param {Object} props - Component props
 * @param {Array} props.projects - List of all projects
 * @param {string|null} props.activeProjectId - ID of the currently active project
 * @param {boolean} props.isOpen - Whether the sidebar is open
 * @param {Function} props.onToggle - Function to toggle sidebar open/close
 * @param {Function} props.onProjectSelect - Function called when a project is selected
 * @param {Function} props.onProjectCreate - Function called to create a new project
 * @param {Function} props.onProjectRename - Function called to rename a project
 * @param {Function} props.onProjectDelete - Function called to delete a project
 * @param {boolean} props.isLoading - Whether projects are loading
 */
const ProjectSidebar = ({
  projects = [],
  activeProjectId,
  isOpen = true,
  onToggle,
  onProjectSelect,
  onProjectCreate,
  onProjectRename,
  onProjectDelete,
  isLoading = false,
}) => {
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    projectId: null,
    x: 0,
    y: 0,
  });

  const [newProjectName, setNewProjectName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createError, setCreateError] = useState("");

  /**
   * Handles right-click context menu for projects
   */
  const handleContextMenu = (e, projectId) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      projectId,
      x: e.clientX,
      y: e.clientY,
    });
  };

  /**
   * Closes the context menu
   */
  const handleCloseContextMenu = () => {
    setContextMenu({
      isOpen: false,
      projectId: null,
      x: 0,
      y: 0,
    });
  };

  /**
   * Handles project creation form submission
   */
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!newProjectName.trim()) {
      setCreateError("Project name is required");
      return;
    }

    // Check for duplicate names
    const existingProject = projects.find(
      (p) => p.name.toLowerCase() === newProjectName.trim().toLowerCase()
    );
    if (existingProject) {
      setCreateError("A project with this name already exists");
      return;
    }

    try {
      const success = await onProjectCreate(newProjectName.trim());
      if (success) {
        setNewProjectName("");
        setShowCreateForm(false);
        setCreateError("");
      } else {
        setCreateError("Failed to create project");
      }
    } catch (error) {
      setCreateError(error.message || "Failed to create project");
    }
  };

  /**
   * Cancels project creation
   */
  const handleCancelCreate = () => {
    setNewProjectName("");
    setShowCreateForm(false);
    setCreateError("");
  };

  /**
   * Handles keyboard navigation
   */
  const handleKeyDown = (e, projectId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onProjectSelect(projectId);
    }
  };

  /**
   * Renders the empty state when no projects exist
   */
  const renderEmptyState = () => (
    <div className="project-sidebar-empty">
      <FolderOpen size={48} className="empty-icon" />
      <h3>No Projects Yet</h3>
      <p>Create your first resume project to get started</p>
      <button
        className="create-first-project-btn"
        onClick={() => setShowCreateForm(true)}
      >
        <Plus size={16} />
        Create Project
      </button>
    </div>
  );

  /**
   * Renders the project creation form
   */
  const renderCreateForm = () => (
    <div className="project-create-form">
      <form onSubmit={handleCreateProject}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter project name..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="project-name-input"
            autoFocus
            maxLength={50}
          />
          {createError && <div className="error-message">{createError}</div>}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Create
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancelCreate}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  /**
   * Renders the project list
   */
  const renderProjectList = () => (
    <div className="project-list">
      {projects.map((project) => (
        <ProjectListItem
          key={project.id}
          project={project}
          isActive={project.id === activeProjectId}
          onClick={() => onProjectSelect(project.id)}
          onContextMenu={(e) => handleContextMenu(e, project.id)}
          isCollapsed={!isOpen}
        />
      ))}
    </div>
  );

  return (
    <>
      <div className={`project-sidebar ${isOpen ? "open" : "collapsed"}`}>
        {/* Sidebar Header */}
        <div className="project-sidebar-header">
          <div className="sidebar-title">
            {isOpen && (
              <>
                <Folder size={20} />
                <span>Projects</span>
              </>
            )}
          </div>
          <button
            className="sidebar-toggle"
            onClick={onToggle}
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="project-sidebar-content">
          {isLoading ? (
            <div className="project-sidebar-loading">
              <div className="loading-spinner"></div>
              {isOpen && <span>Loading projects...</span>}
            </div>
          ) : (
            <>
              {/* Create Project Button */}
              {isOpen && projects.length > 0 && !showCreateForm && (
                <div className="project-sidebar-actions">
                  <button
                    className="new-project-btn"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <Plus size={16} />
                    New Project
                  </button>
                </div>
              )}

              {/* Create Project Form */}
              {isOpen && showCreateForm && renderCreateForm()}

              {/* Project List or Empty State */}
              {projects.length === 0
                ? isOpen && renderEmptyState()
                : renderProjectList()}
            </>
          )}
        </div>

        {/* Sidebar Footer */}
        {isOpen && (
          <div className="project-sidebar-footer">
            <div className="project-count">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </div>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu.isOpen && (
        <ProjectContextMenu
          projectId={contextMenu.projectId}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          onRename={onProjectRename}
          onDelete={onProjectDelete}
          projects={projects}
        />
      )}
    </>
  );
};

export default ProjectSidebar;
