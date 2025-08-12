/**
 * @fileoverview Individual project list item component
 *
 * This component represents a single project in the sidebar list,
 * showing project name, chat preview, and handling selection/context menu.
 */

import React from "react";
import { FileText, MessageSquare, Clock } from "lucide-react";

/**
 * ProjectListItem component for displaying individual projects
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data
 * @param {boolean} props.isActive - Whether this project is currently active
 * @param {Function} props.onClick - Function called when project is clicked
 * @param {Function} props.onContextMenu - Function called on right-click
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed
 */
const ProjectListItem = ({
  project,
  isActive = false,
  onClick,
  onContextMenu,
  isCollapsed = false,
}) => {
  /**
   * Formats the project's last updated time
   */
  const formatLastUpdated = (updatedAt) => {
    try {
      const date = new Date(updatedAt);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInHours < 24 * 7) {
        return `${Math.floor(diffInHours / 24)}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return "";
    }
  };

  /**
   * Truncates text to specified length
   */
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  /**
   * Gets the chat preview text
   */
  const getChatPreview = () => {
    if (project.lastChatMessage) {
      return truncateText(project.lastChatMessage, 60);
    }
    return "No messages yet";
  };

  /**
   * Handles click events
   */
  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  };

  /**
   * Handles context menu events
   */
  const handleContextMenu = (e) => {
    e.preventDefault();
    onContextMenu(e);
  };

  if (isCollapsed) {
    // Collapsed view - show only icon and active indicator
    return (
      <div
        className={`project-list-item collapsed ${isActive ? "active" : ""}`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Select project ${project.name}`}
        title={`${project.name}${
          project.lastChatMessage ? `\n${getChatPreview()}` : ""
        }`}
      >
        <div className="project-icon">
          <FileText size={20} />
        </div>
        {isActive && <div className="active-indicator" />}
      </div>
    );
  }

  // Expanded view - show full project details
  return (
    <div
      className={`project-list-item expanded ${isActive ? "active" : ""}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Select project ${project.name}`}
    >
      <div className="project-item-header">
        <div className="project-icon">
          <FileText size={18} />
        </div>
        <div className="project-info">
          <div className="project-name" title={project.name}>
            {truncateText(project.name, 25)}
          </div>
          <div className="project-meta">
            <Clock size={12} />
            <span className="last-updated">
              {formatLastUpdated(project.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="project-item-preview">
        <div className="chat-preview">
          <MessageSquare size={14} />
          <span className="preview-text">{getChatPreview()}</span>
        </div>
      </div>

      {isActive && <div className="active-indicator" />}
    </div>
  );
};

export default ProjectListItem;
