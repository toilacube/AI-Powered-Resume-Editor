import React, { useState, useEffect, useRef } from "react";
import { Target, X } from "lucide-react";
import JobDescriptionInput from "./JobDescriptionInput";
import AnalysisResults from "./AnalysisResults";
import { analyzeJobDescription } from "../utils/openaiService";

/**
 * JobDescriptionAnalyzer Component
 *
 * Props:
 * - resumeData: object - Current resume data
 * - apiKey: string - Gemini API key
 * - selectedModel: string - Current AI model selection
 * - onClose: function - Function to close the analyzer
 *
 * State:
 * - isAnalyzing: boolean - Loading state during analysis
 * - jobDescription: string - Job description text input
 * - analysisResults: object - Results with matched and missing skills
 * - error: string - Error messages
 * - showResults: boolean - Toggle between input and results view
 */
const JobDescriptionAnalyzer = ({
  resumeData,
  apiKey,
  selectedModel,
  onClose,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const modalRef = useRef(null);

  // Handle keyboard navigation and focus management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    // Focus the modal when it opens
    if (modalRef.current) {
      modalRef.current.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Trap focus within the modal
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    modal.addEventListener("keydown", handleTabKey);
    return () => modal.removeEventListener("keydown", handleTabKey);
  }, [showResults]); // Re-run when view changes

  const handleAnalyze = async () => {
    // Input validation
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError(
        "Job description is too short. Please provide at least 50 characters for meaningful analysis."
      );
      return;
    }

    if (jobDescription.length > 10000) {
      setError(
        "Job description is too long. Please keep it under 10,000 characters."
      );
      return;
    }

    if (!apiKey) {
      setError(
        "API key is required. Please configure it in the AI & API Settings section."
      );
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const results = await analyzeJobDescription(
        jobDescription,
        resumeData,
        apiKey,
        selectedModel
      );
      setAnalysisResults(results);
      setShowResults(true);
    } catch (err) {
      console.error("Job analysis error:", err);

      // Handle specific error types
      if (err.message.includes("API key")) {
        setError(
          "Invalid API key. Please check your Gemini API key in settings."
        );
      } else if (
        err.message.includes("network") ||
        err.message.includes("fetch")
      ) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else if (
        err.message.includes("rate limit") ||
        err.message.includes("quota")
      ) {
        setError(
          "API rate limit exceeded. Please wait a moment and try again."
        );
      } else if (err.message.includes("too short")) {
        setError("Job description is too short for meaningful analysis.");
      } else {
        setError(
          err.message || "Failed to analyze job description. Please try again."
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBackToInput = () => {
    setShowResults(false);
    setAnalysisResults(null);
    setError("");
  };

  const handleClose = () => {
    setJobDescription("");
    setAnalysisResults(null);
    setError("");
    setShowResults(false);
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className="job-analysis-modal"
      role="dialog"
      aria-labelledby="job-analysis-title"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="job-analysis-header">
        <div className="job-analysis-title">
          <Target size={20} aria-hidden="true" />
          <h3 id="job-analysis-title">Job Description Analysis</h3>
        </div>
        <button
          className="close-button"
          onClick={handleClose}
          aria-label="Close job analysis dialog"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="job-analysis-content">
        {!showResults ? (
          <JobDescriptionInput
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            disabled={isAnalyzing}
            error={error}
          />
        ) : (
          <AnalysisResults
            results={analysisResults}
            onBack={handleBackToInput}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default JobDescriptionAnalyzer;
