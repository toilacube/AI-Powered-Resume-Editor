# Multi-Project Management Guide

This guide explains how to use the multi-project management feature in the AI Resume Assistant.

## Overview

The multi-project management system allows you to:

- Create and manage multiple resume projects
- Switch between different resumes for different job applications
- Keep separate chat histories and resume versions for each project
- Organize your work with meaningful project names

## Getting Started

### First Time Users

When you first open the application, a default project called "My Resume" will be automatically created for you. If you have existing resume data, it will be migrated to this default project.

### Creating a New Project

1. **Using the Sidebar**: Click the "New Project" button in the project sidebar
2. **First Project**: If you have no projects, click "Create Project" in the empty state

### Project Sidebar

The project sidebar on the left shows all your projects:

- **Project Name**: The name you gave to the project
- **Last Updated**: When the project was last modified
- **Chat Preview**: A preview of the latest chat message

#### Sidebar Controls

- **Toggle Button**: Collapse/expand the sidebar
- **Project List**: Click any project to switch to it
- **Right-click Menu**: Right-click on a project for rename/delete options

## Managing Projects

### Switching Projects

Simply click on any project in the sidebar to switch to it. The application will:

- Save your current work automatically
- Load the selected project's resume data
- Load the project's chat history
- Update the interface to show the active project

### Renaming Projects

1. Right-click on a project in the sidebar
2. Select "Rename" from the context menu
3. Type the new name and press Enter
4. Or press Escape to cancel

### Deleting Projects

1. Right-click on a project in the sidebar
2. Select "Delete" from the context menu
3. Confirm the deletion in the dialog

**Warning**: Deleting a project permanently removes all its data, including:

- Resume data
- Chat history
- Resume version history

## Data Isolation

Each project maintains completely separate data:

### Resume Data

- Each project has its own resume information
- Changes in one project don't affect others
- You can have completely different resumes for different career paths

### Chat History

- Conversations with the AI are kept separate per project
- Each project maintains its own context and conversation flow
- Chat history is automatically saved as you interact

### Version History

- Each project tracks its own resume changes
- You can revert to previous versions within each project
- Version history is independent between projects

## Storage and Persistence

### Local Storage

All project data is stored locally in your browser:

- Projects index and metadata
- Resume data per project
- Chat history per project
- Resume version history per project

### Session Management

- The last active project is remembered between sessions
- When you return to the app, it opens your last used project
- If the last project no longer exists, it opens the first available project

### Data Migration

The system automatically migrates existing single-project data:

- Existing resume data becomes the default project
- Chat and version history are preserved
- Migration happens seamlessly on first load

## Best Practices

### Project Organization

- Use descriptive names like "Software Engineer Resume" or "Marketing Manager CV"
- Create separate projects for different industries or roles
- Keep projects focused on specific job applications or career paths

### Data Management

- Regularly review and clean up old projects you no longer need
- Use the chat feature to document changes and decisions
- Take advantage of version history to experiment with different approaches

### Workflow Tips

- Create a new project when applying for a significantly different role
- Use the chat history to remember what changes you made and why
- Switch between projects to compare different resume approaches

## Keyboard Navigation

The project sidebar supports keyboard navigation:

- **Tab**: Navigate between projects
- **Enter/Space**: Select a project
- **Escape**: Close context menus or cancel operations

## Responsive Design

The project sidebar adapts to different screen sizes:

- **Desktop**: Full sidebar with project details
- **Tablet**: Collapsible sidebar
- **Mobile**: Full-screen overlay when open

## Troubleshooting

### Projects Not Loading

- Check browser console for errors
- Clear browser cache and reload
- Ensure localStorage is enabled in your browser

### Data Loss Prevention

- Projects are automatically saved as you work
- Data is stored locally in your browser
- Consider exporting important resumes as PDF backups

### Performance

- The system is optimized for multiple projects
- Large chat histories are handled efficiently
- Project switching is fast and responsive

### Browser Compatibility

- Works in all modern browsers
- Requires localStorage support
- JavaScript must be enabled

## Technical Details

### Storage Keys

Projects use prefixed storage keys:

- `projects_index`: Main project index
- `resume_<projectId>`: Project-specific resume data
- `chat_history_<projectId>`: Project-specific chat history
- `resume_history_<projectId>`: Project-specific version history

### Data Structure

Each project contains:

```javascript
{
  id: "unique-project-id",
  name: "Project Name",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  lastChatMessage: "Preview of last chat message"
}
```

### Migration Process

Legacy data migration:

1. Detects existing single-project data
2. Creates default project "My Resume"
3. Migrates resume data and history
4. Cleans up old storage keys
5. Sets new project as active

## API Reference

### ProjectStorage Class

Main storage utility for project operations:

- `createProject(name, initialData)`: Create new project
- `getAllProjects()`: Get all projects
- `getActiveProject()`: Get currently active project
- `setActiveProject(projectId)`: Set active project
- `updateProject(projectId, updates)`: Update project metadata
- `deleteProject(projectId)`: Delete project and all data
- `getProjectData(projectId)`: Get project-specific data
- `saveProjectData(projectId, data)`: Save project-specific data
- `migrateLegacyData()`: Migrate from single-project structure

### Hooks

React hooks for project management:

- `useProjectManager()`: Main project management hook
- `useProjectData(projectId)`: Project-specific data management
- `useResumeHistory(projectId)`: Project-aware resume history
- `useChat(..., projectId)`: Project-aware chat functionality

## Support

If you encounter issues with the multi-project system:

1. Check the browser console for error messages
2. Try refreshing the page
3. Clear browser cache if problems persist
4. Ensure you're using a supported browser

The multi-project system is designed to be robust and user-friendly, automatically handling edge cases and providing a smooth experience for managing multiple resumes.
