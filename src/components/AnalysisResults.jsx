import React from "react";
import { ArrowLeft, CheckCircle, AlertTriangle, X } from "lucide-react";
import SkillTag from "./SkillTag";

/**
 * AnalysisResults Component
 *
 * Props:
 * - results: object - Analysis results with matched and missing arrays
 * - onBack: function - Function to go back to input view
 * - onClose: function - Function to close the entire analysis modal
 */
const AnalysisResults = ({ results, onBack, onClose }) => {
  const { matched = [], missing = [] } = results || {};

  return (
    <div className="analysis-results">
      <div className="results-header">
        <button
          className="back-button"
          onClick={onBack}
          aria-label="Back to job description input"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back</span>
        </button>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close analysis dialog"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="results-content">
        {/* Matched Skills Section */}
        <div className="results-section matched-section">
          <div className="section-header">
            <CheckCircle
              size={20}
              className="section-icon matched-icon"
              aria-hidden="true"
            />
            <h4 id="matched-skills-heading">Skills You Have</h4>
            <span
              className="skill-count"
              aria-label={`${matched.length} matched skills`}
            >
              ({matched.length})
            </span>
          </div>

          <div
            className="skills-container"
            role="list"
            aria-labelledby="matched-skills-heading"
          >
            {matched.length > 0 ? (
              matched.map((skill, index) => (
                <SkillTag
                  key={`matched-${index}`}
                  skill={skill}
                  type="matched"
                  size="md"
                />
              ))
            ) : (
              <div className="empty-state">
                <p>
                  No matching skills found in your resume for this job
                  description.
                </p>
                <p className="empty-state-hint">
                  Consider updating your resume to better highlight relevant
                  experience.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Missing Skills Section */}
        <div className="results-section missing-section">
          <div className="section-header">
            <AlertTriangle
              size={20}
              className="section-icon missing-icon"
              aria-hidden="true"
            />
            <h4 id="missing-skills-heading">Skills to Develop</h4>
            <span
              className="skill-count"
              aria-label={`${missing.length} missing skills`}
            >
              ({missing.length})
            </span>
          </div>

          <div className="skills-container">
            {missing.length > 0 ? (
              missing.map((skill, index) => (
                <SkillTag
                  key={`missing-${index}`}
                  skill={skill}
                  type="missing"
                  size="md"
                />
              ))
            ) : (
              <div className="empty-state">
                <p>
                  Great! Your resume covers all the key requirements mentioned
                  in this job description.
                </p>
                <p className="empty-state-hint">
                  You appear to be well-qualified for this position.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="results-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-number matched-color">{matched.length}</span>
            <span className="stat-label">Matched</span>
          </div>
          <div className="stat-divider">•</div>
          <div className="stat-item">
            <span className="stat-number missing-color">{missing.length}</span>
            <span className="stat-label">Missing</span>
          </div>
        </div>

        {matched.length > 0 && missing.length > 0 && (
          <p className="summary-text">
            Your resume matches {matched.length} requirements. Consider
            developing the {missing.length} missing skills to strengthen your
            application.
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
