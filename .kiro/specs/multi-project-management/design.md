# Design Document

## Overview

The multi-project management feature transforms the current single-resume application into a project-based system. The design maintains the existing React architecture while introducing a project management layer that handles data isolation, project switching, and a new sidebar interface for project navigation.

The solution leverages the existing local storage patterns and extends them with project-specific keys, ensuring backward compatibility while enabling multiple project workflows.

## Architecture

### Current Architecture Analysis

- **Frontend**: React with functional components and custom hooks
- **State Management**: Local state with custom hooks (`useResumeHistory`, `useChat`, `useResumeData`)
- **Data Persistence**: Browser localStorage with specific keys (`resumeData`, `resumeHistory`, `gemini_api_key`)
- **UI Layout**: Three-panel layout (left sidebar, main content, right sidebar)

### New Architecture Components

- **Project Management Layer**: New hooks and utilities for project CRUD operations
- **Enhanced Sidebar**: Collapsible project list with context menus
- **Project Context**: React context for managing active project state
- **Storage Abstraction**: Utilities for project-specific data management

## Components and Interfaces

### New Components

#### ProjectSidebar Component

```typescript
interface ProjectSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  projects: Project[];
  activeProjectId: string;
  onProjectSelect: (projectId: string) => void;
  onProjectCreate: (name: string) => void;
  onProjectRename: (projectId: string, newName: string) => void;
  onProjectDelete: (projectId: string) => void;
}
```

#### ProjectListItem Component

```typescript
interface ProjectListItemProps {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  latestChatMessage?: string;
}
```

#### ProjectContextMenu Component

```typescript
interface ProjectContextMenuProps {
  projectId: string;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
  position: { x: number; y: number };
}
```

### Data Models

#### Project Interface

```typescript
interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  lastChatMessage?: string;
}
```

#### ProjectData Interface

```typescript
interface ProjectData {
  resumeData: ResumeData;
  chatHistory: ChatMessage[];
  resumeHistory: HistoryEntry[];
}
```

### Custom Hooks

#### useProjectManager Hook

```typescript
interface UseProjectManagerReturn {
  projects: Project[];
  activeProjectId: string | null;
  createProject: (name: string) => Promise<string>;
  renameProject: (id: string, newName: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  switchProject: (id: string) => Promise<void>;
  getProjectData: (id: string) => ProjectData | null;
  saveProjectData: (id: string, data: Partial<ProjectData>) => Promise<void>;
}
```

#### useProjectData Hook

```typescript
interface UseProjectDataReturn {
  resumeData: ResumeData;
  chatHistory: ChatMessage[];
  resumeHistory: HistoryEntry[];
  updateResumeData: (data: ResumeData, message: string) => void;
  updateChatHistory: (messages: ChatMessage[]) => void;
  isLoading: boolean;
}
```

## Data Models

### Storage Schema

#### Projects Index

- **Key**: `projects_index`
- **Structure**:

```json
{
  "projects": [
    {
      "id": "uuid-1",
      "name": "Software Engineer Resume",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T15:30:00Z",
      "lastChatMessage": "Updated skills section"
    }
  ],
  "activeProjectId": "uuid-1"
}
```

#### Project-Specific Data

- **Resume Data Key**: `resume_<projectId>`
- **Chat History Key**: `chat_history_<projectId>`
- **Resume History Key**: `resume_history_<projectId>`

### Migration Strategy

#### Backward Compatibility

1. **Detection**: Check for existing `resumeData` and `resumeHistory` keys
2. **Migration**: Create default project with existing data
3. **Cleanup**: Remove old keys after successful migration
4. **Fallback**: Handle cases where migration fails gracefully

```typescript
interface MigrationResult {
  success: boolean;
  defaultProjectId?: string;
  errors?: string[];
}
```

## Error Handling

### Project Management Errors

- **Storage Quota Exceeded**: Implement cleanup strategies and user notifications
- **Corrupted Project Data**: Provide recovery options and data validation
- **Project Not Found**: Graceful fallback to available projects
- **Naming Conflicts**: Automatic name resolution with suffixes

### Data Consistency

- **Atomic Operations**: Ensure project operations complete fully or rollback
- **Validation**: Validate project data structure before saving
- **Backup**: Maintain backup copies during critical operations

### User Experience

- **Loading States**: Show appropriate loading indicators during operations
- **Error Messages**: Provide clear, actionable error messages
- **Recovery Options**: Offer ways to recover from error states

## Testing Strategy

### Unit Tests

- **Project Management Hooks**: Test CRUD operations and state management
- **Storage Utilities**: Test data persistence and retrieval
- **Migration Logic**: Test backward compatibility scenarios
- **Data Validation**: Test input validation and error handling

### Integration Tests

- **Project Switching**: Test complete project switching workflow
- **Data Isolation**: Verify project data remains separate
- **UI Interactions**: Test sidebar interactions and context menus
- **Storage Operations**: Test localStorage operations across projects

### User Acceptance Tests

- **Project Lifecycle**: Create, rename, delete projects end-to-end
- **Data Persistence**: Verify data survives browser sessions
- **Migration**: Test upgrade from single-project to multi-project
- **Performance**: Test with multiple projects and large datasets

### Test Data

- **Mock Projects**: Create realistic test project data
- **Edge Cases**: Test with empty projects, long names, special characters
- **Performance**: Test with large numbers of projects
- **Migration**: Test various existing data scenarios

## Implementation Considerations

### Performance Optimizations

- **Lazy Loading**: Load project data only when needed
- **Debounced Saves**: Batch storage operations to reduce I/O
- **Memory Management**: Clean up unused project data from memory
- **Virtual Scrolling**: Handle large project lists efficiently

### Accessibility

- **Keyboard Navigation**: Full keyboard support for project management
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Focus Management**: Maintain focus during project operations
- **High Contrast**: Ensure visibility in high contrast modes

### Browser Compatibility

- **localStorage Support**: Graceful degradation for limited storage
- **Modern Features**: Progressive enhancement for newer browsers
- **Storage Limits**: Handle browser-specific storage limitations
- **Cross-Tab Sync**: Consider synchronization across browser tabs
