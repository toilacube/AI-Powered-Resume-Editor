import React from "react";
import { Search, AlertCircle } from "lucide-react";

/**
 * JobDescriptionInput Component
 *
 * Props:
 * - jobDescription: string - Current job description text
 * - onJobDescriptionChange: function - Function to update job description
 * - onAnalyze: function - Function to trigger analysis
 * - isAnalyzing: boolean - Loading state
 * - disabled: boolean - Disable input during analysis
 * - error: string - Error message to display
 */
const JobDescriptionInput = ({
  jobDescription,
  onJobDescriptionChange,
  onAnalyze,
  isAnalyzing,
  disabled,
  error,
}) => {
  const characterCount = jobDescription.length;
  const minLength = 50;
  const maxLength = 10000;
  const isValidLength =
    characterCount >= minLength && characterCount <= maxLength;

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      (e.ctrlKey || e.metaKey) &&
      !disabled &&
      isValidLength
    ) {
      onAnalyze();
    }
  };

  return (
    <div className="job-input-container">
      <div className="job-input-section">
        <label htmlFor="job-description-textarea" className="job-input-label">
          Paste Job Description
        </label>
        <textarea
          id="job-description-textarea"
          className={`job-description-textarea ${error ? "error" : ""}`}
          placeholder="Paste the job description here to analyze how well your resume matches the requirements..."
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={12}
          maxLength={maxLength}
        />

        <div className="job-input-footer">
          <div className="character-count">
            <span className={characterCount > maxLength ? "error" : ""}>
              {characterCount.toLocaleString()}/{maxLength.toLocaleString()}
            </span>
            {characterCount < minLength && (
              <span className="min-length-hint">
                (minimum {minLength} characters)
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
            {error.includes("network") || error.includes("failed") ? (
              <button
                className="retry-button"
                onClick={onAnalyze}
                disabled={disabled || !isValidLength}
              >
                Retry
              </button>
            ) : null}
          </div>
        )}
      </div>

      <div className="job-input-actions">
        <button
          className="analyze-button"
          onClick={onAnalyze}
          disabled={disabled || !isValidLength}
        >
          {isAnalyzing ? (
            <>
              <div className="spinner" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Analyze Match</span>
            </>
          )}
        </button>

        {!isValidLength && jobDescription.length > 0 && (
          <p className="validation-hint">
            {characterCount < minLength
              ? `Please enter at least ${minLength} characters for meaningful analysis`
              : `Please keep under ${maxLength.toLocaleString()} characters`}
          </p>
        )}

        <p className="keyboard-hint">
          Press Ctrl+Enter (Cmd+Enter on Mac) to analyze
        </p>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
