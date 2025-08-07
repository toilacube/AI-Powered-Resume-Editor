import React, { useState, useEffect } from "react";
import {
  Download,
  Bot,
  KeyRound,
  ChevronDown,
  ChevronUp,
  History,
} from "lucide-react";
import { applyPatch } from "fast-json-patch";

import { useResumeHistory } from "./hooks/useResumeHistory";
import { useChat } from "./hooks/useChat";
import { generatePDF } from "./utils/pdfUtils";
import { validateResumeData } from "./utils/resumeValidator";

import ResumeTemplate from "./components/ResumeTemplate";
import ChatInterface from "./components/ChatInterface";
import HistoryPanel from "./components/HistoryPanel";
import "./styles/App.css";

function App() {
  const {
    resumeData,
    history,
    updateResumeAndCreateHistory,
    applyHistoryVersion,
  } = useResumeHistory();

  // 1. ADD STATE FOR THE API KEY
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("gemini_api_key") || ""
  );

  // 2. SAVE API KEY TO LOCALSTORAGE WHENEVER IT CHANGES
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("gemini_api_key", apiKey);
    } else {
      // Avoid storing an empty key
      localStorage.removeItem("gemini_api_key");
    }
  }, [apiKey]);

  const handleResumeUpdate = (patches, userMessage) => {
    try {
      // Apply the patch and create a deep clone to ensure the state is truly new
      const { newDocument } = applyPatch(
        JSON.parse(JSON.stringify(resumeData)),
        patches
      );

      // Call the history hook to save this new version
      updateResumeAndCreateHistory(newDocument, userMessage);
    } catch (e) {
      console.error("Failed to apply JSON patch:", e);
    }
  };

  // Add state for model selection
  const [selectedModel, setSelectedModel] = useState(
    () => localStorage.getItem("selected_model") || "gemini-2.0-flash-lite"
  );

  // Save model preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("selected_model", selectedModel);
  }, [selectedModel]);

  // 3. PASS THE API KEY AND SELECTED MODEL TO THE useChat HOOK
  const { messages, isLoading, sendMessage } = useChat(
    handleResumeUpdate,
    resumeData,
    apiKey,
    selectedModel // Pass the selected model here
  );

  // State for collapsible sections
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Bot size={24} />
          <h2>CV Assistant</h2>
        </div>
        <div className="chat-container">
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
          />
        </div>

        <div className="sidebar-footer">
          {/* Collapsible History Panel */}
          <div className="collapsible-section">
            <div
              className="section-header"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            >
              <div className="section-title">
                <History size={16} />
                <span>History</span>
              </div>
              {isHistoryOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>
            {isHistoryOpen && (
              <HistoryPanel
                history={history}
                onApplyVersion={applyHistoryVersion}
              />
            )}
          </div>
          {/* Collapsible Settings Section */}
          <div className="collapsible-section">
            <div
              className="section-header"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <div className="section-title">
                <KeyRound size={16} />
                <span>Settings</span>
              </div>
              {isSettingsOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>

            {isSettingsOpen && (
              <div className="settings-content">
                {/* Model Selection Dropdown */}
                <div className="model-selector">
                  <label htmlFor="model-select">Model:</label>
                  <select
                    id="model-select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="model-dropdown"
                  >
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    <option value="gemini-2.0-flash-lite">
                      Gemini 2.0 Flash Lite
                    </option>
                  </select>
                </div>

                {/* API Key Input */}
                <div className="api-key-input-container">
                  <KeyRound size={16} />
                  <input
                    type="password"
                    className="api-key-input"
                    placeholder="Enter Gemini API Key here"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <button className="action-button" onClick={() => generatePDF()}>
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </aside>
      <main className="main-content">
        <ResumeTemplate data={resumeData} />
      </main>
    </div>
  );
}

export default App;
