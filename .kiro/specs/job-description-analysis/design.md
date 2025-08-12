# Design Document

## Overview

The job description analysis feature will be integrated into the existing resume application as a new action in the right sidebar. It will provide users with the ability to paste job descriptions and receive AI-powered analysis comparing their resume against job requirements. The feature will leverage the existing Google Gemini API integration and follow the application's established design patterns.

## Architecture

### Component Structure

```
JobDescriptionAnalysis/
├── JobDescriptionAnalyzer.jsx (Main component)
├── JobDescriptionInput.jsx (Text area and analyze button)
├── AnalysisResults.jsx (Results display component)
└── SkillTag.jsx (Individual skill/requirement tag)
```

### Integration Points

- **Right Sidebar**: New action button "Analyze Job Description" added to existing action-buttons-group
- **API Service**: Extend existing `openaiService.js` to include job analysis function
- **State Management**: Local component state for job description text and analysis results
- **Styling**: Leverage existing CSS custom properties from `index.css`

## Components and Interfaces

### JobDescriptionAnalyzer Component

**Props:**

- `resumeData`: Current resume data object
- `apiKey`: Gemini API key from app state
- `selectedModel`: Current AI model selection

**State:**

- `isAnalyzing`: Boolean for loading state
- `jobDescription`: String for job description text
- `analysisResults`: Object containing matched and missing skills
- `error`: String for error messages
- `showAnalysis`: Boolean to toggle analysis view

### JobDescriptionInput Component

**Props:**

- `jobDescription`: Current job description text
- `onJobDescriptionChange`: Function to update job description
- `onAnalyze`: Function to trigger analysis
- `isAnalyzing`: Boolean for loading state
- `disabled`: Boolean to disable input during analysis

### AnalysisResults Component

**Props:**

- `results`: Analysis results object with structure:
  ```javascript
  {
    matched: ["Java", "Spring Boot", "AWS", ...],
    missing: ["Kubernetes", "GraphQL", "Terraform", ...]
  }
  ```
- `onClose`: Function to close results view

### SkillTag Component

**Props:**

- `skill`: String skill/requirement name
- `type`: "matched" | "missing" for styling
- `size`: "sm" | "md" for different contexts

## Data Models

### Job Analysis Request

```javascript
{
  jobDescription: string,
  resumeData: object, // Current resume data
  analysisType: "skills_match" // Fixed value for this feature
}
```

### Job Analysis Response

```javascript
{
  matched: string[], // Skills/requirements found in resume
  missing: string[], // Skills/requirements not found or not emphasized
  confidence: number, // Optional: confidence score 0-1
  suggestions?: string[] // Optional: improvement suggestions
}
```

### API Integration

New function in `openaiService.js`:

```javascript
export const analyzeJobDescription = async (
  jobDescription,
  resumeData,
  apiKey,
  model = "gemini-2.0-flash"
) => {
  // Implementation details in tasks
};
```

## User Interface Design

### Action Button Integration

- Add new button to right sidebar action-buttons-group
- Icon: Search or Target icon from lucide-react
- Text: "Analyze Job Description"
- Styling: Follow existing action-button class patterns

### Analysis Modal/Panel Design

- **Layout**: Overlay modal or expandable panel in right sidebar
- **Header**: "Job Description Analysis" with close button
- **Input Section**:
  - Label: "Paste Job Description"
  - Textarea with placeholder text
  - Character limit indicator (optional)
  - Analyze button (primary styling)
- **Results Section**:
  - Two-column layout for matched vs missing
  - Color-coded sections using CSS custom properties
  - Skill tags with appropriate styling

### Visual Design Specifications

#### Color Scheme (using existing CSS custom properties)

- **Matched Skills**:
  - Background: `color-mix(in srgb, var(--color-secondary) 20%, var(--color-surface))`
  - Border: `var(--color-secondary)`
  - Text: `var(--color-text-primary)`
- **Missing Skills**:
  - Background: `color-mix(in srgb, var(--color-primary) 20%, var(--color-surface))`
  - Border: `var(--color-primary)`
  - Text: `var(--color-text-primary)`

#### Typography

- Section headers: `var(--text-lg)` with `font-weight: 600`
- Skill tags: `var(--text-sm)` with `font-weight: 500`
- Input labels: `var(--text-sm)` with `color: var(--color-text-secondary)`

#### Spacing and Layout

- Modal padding: `var(--spacing-xl)`
- Section gaps: `var(--spacing-lg)`
- Tag spacing: `var(--spacing-sm)`
- Border radius: `var(--radius-md)` for containers, `var(--radius-sm)` for tags

## Error Handling

### API Error Scenarios

1. **Missing API Key**: Display user-friendly message directing to settings
2. **Network Errors**: Show retry option with error details
3. **Invalid Job Description**: Provide guidance on expected format
4. **Rate Limiting**: Display appropriate wait time message
5. **Parsing Errors**: Fallback to basic text analysis

### Input Validation

- **Empty Job Description**: Disable analyze button, show helper text
- **Minimum Length**: Require at least 50 characters for meaningful analysis
- **Maximum Length**: Limit to 10,000 characters to prevent API issues

### Error UI Components

- Error messages styled with existing patterns
- Retry buttons following action-button styling
- Loading states with spinner animation (existing `.spinner` class)

## Testing Strategy

### Unit Tests

- **JobDescriptionAnalyzer**: State management, prop handling, error scenarios
- **AnalysisResults**: Correct rendering of matched/missing skills
- **SkillTag**: Proper styling based on type prop
- **API Service**: Mock API responses, error handling

### Integration Tests

- **Full Analysis Flow**: From button click to results display
- **API Integration**: Real API calls with test data
- **Error Scenarios**: Network failures, invalid responses

### User Experience Tests

- **Accessibility**: Keyboard navigation, screen reader compatibility
- **Responsive Design**: Mobile and tablet layouts
- **Performance**: Large job descriptions, multiple analyses

## Performance Considerations

### Optimization Strategies

- **Debounced Input**: Prevent excessive API calls during typing
- **Result Caching**: Cache analysis results for identical job descriptions
- **Lazy Loading**: Load analysis component only when needed
- **Text Truncation**: Limit display of very long skill lists

### Memory Management

- Clear analysis results when component unmounts
- Limit stored analysis history to prevent memory leaks
- Optimize re-renders with React.memo where appropriate

## Accessibility

### WCAG Compliance

- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: Ensure sufficient contrast ratios for all text
- **Focus Management**: Clear focus indicators and logical tab order

### Semantic HTML

- Use proper heading hierarchy (h1-h6)
- Form labels associated with inputs
- Button elements for interactive actions
- List elements for skill collections

## Security Considerations

### Data Handling

- **Job Description Privacy**: No persistent storage of job descriptions
- **API Key Security**: Leverage existing secure storage patterns
- **Input Sanitization**: Prevent XSS through proper text handling
- **Rate Limiting**: Respect API rate limits to prevent abuse

### Content Security

- Validate and sanitize all user inputs
- Prevent injection attacks through proper escaping
- Secure API communication over HTTPS only
