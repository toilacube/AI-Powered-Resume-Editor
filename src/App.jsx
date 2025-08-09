import React, { useState, useEffect } from "react";
import {
  Bot,
  KeyRound,
  ChevronDown,
  ChevronUp,
  History,
  Upload,
} from "lucide-react";
import { applyPatch } from "fast-json-patch";

import { useResumeHistory } from "./hooks/useResumeHistory";
import { useChat } from "./hooks/useChat";
import ConfirmationModal from "./components/ConfirmationModal";

import ResumeTemplate from "./components/ResumeTemplate";
import ChatInterface from "./components/ChatInterface";
import HistoryPanel from "./components/HistoryPanel";
import "./styles/App.css"; // Main application shell styles
import "./styles/Chat.css"; // Component-specific styles
import "./styles/HistoryPanel.css";
import "./styles/Modal.css";
import { extractDataFromPdf } from "./utils/openaiService";

function App() {
  const {
    resumeData,
    history,
    updateResumeAndCreateHistory,
    applyHistoryVersion,
  } = useResumeHistory();

  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("gemini_api_key") || ""
  );

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("gemini_api_key", apiKey);
    } else {
      localStorage.removeItem("gemini_api_key");
    }
  }, [apiKey]);

  const handleResumeUpdate = (patches, userMessage) => {
    try {
      const { newDocument } = applyPatch(
        JSON.parse(JSON.stringify(resumeData)),
        patches
      );
      updateResumeAndCreateHistory(newDocument, userMessage);
    } catch (e) {
      console.error("Failed to apply JSON patch:", e);
    }
  };

  const [selectedModel, setSelectedModel] = useState(
    () => localStorage.getItem("selected_model") || "gemini-2.0-flash"
  );

  useEffect(() => {
    localStorage.setItem("selected_model", selectedModel);
  }, [selectedModel]);

  const { messages, isLoading, sendMessage } = useChat(
    handleResumeUpdate,
    resumeData,
    apiKey,
    selectedModel
  );

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = React.useRef(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    jsonText: "",
    error: null,
  });

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Please select a file smaller than 5MB.");
      return;
    }
    setIsExtracting(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1];
        const extractedJson = await extractDataFromPdf(
          base64String,
          apiKey,
          selectedModel
        );
        setModalState({
          isOpen: true,
          jsonText: JSON.stringify(extractedJson, null, 2),
          error: null,
        });
      };
    } catch (error) {
      alert(`Error processing PDF: ${error.message}`);
    } finally {
      setIsExtracting(false);
      event.target.value = null;
    }
  };

  const handleModalApply = (jsonText) => {
    try {
      const newResumeData = JSON.parse(jsonText);
      updateResumeAndCreateHistory(
        newResumeData,
        "Replaced resume from PDF upload"
      );
      setModalState({ isOpen: false, jsonText: "", error: null });
    } catch (error) {
      setModalState((prev) => ({ ...prev, error: "Invalid JSON format." }));
    }
  };

  const handleModalCancel = () => {
    setModalState({ isOpen: false, jsonText: "", error: null });
  };

  const handleModalJsonChange = (newJsonText) => {
    setModalState((prev) => ({ ...prev, jsonText: newJsonText, error: null }));
  };

  return (
    <div className="app-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        style={{ display: "none" }}
      />

      <ConfirmationModal
        isOpen={modalState.isOpen}
        jsonText={modalState.jsonText}
        onJsonTextChange={handleModalJsonChange}
        onApply={() => handleModalApply(modalState.jsonText)}
        onCancel={handleModalCancel}
        error={modalState.error}
      />

      {/* Left Sidebar */}
      <aside className="left-sidebar">
        <div className="sidebar-header">
          <Bot size={28} color="var(--color-secondary)" />
          <h2>AI Resume Assistant</h2>
        </div>

        <div className="sidebar-footer">
          <div className="collapsible-section">
            <div
              className="section-header"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            >
              <div className="section-title">
                <History size={16} />
                <span>Change History</span>
              </div>
              {isHistoryOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
            {isHistoryOpen && (
              <HistoryPanel
                history={history}
                onApplyVersion={applyHistoryVersion}
              />
            )}
          </div>

          <div className="collapsible-section">
            <div
              className="section-header"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <div className="section-title">
                <KeyRound size={16} />
                <span>AI & API Settings</span>
              </div>
              {isSettingsOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
            {isSettingsOpen && (
              <div className="settings-content">
                <div className="setting-item">
                  <label htmlFor="model-select">AI Model</label>
                  <select
                    id="model-select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="styled-select"
                  >
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    <option value="gemini-2.0-flash-lite">
                      Gemini 2.0 Flash Lite
                    </option>
                  </select>
                </div>
                <div className="setting-item">
                  <label htmlFor="api-key-input">Gemini API Key</label>
                  <div className="api-key-input-wrapper">
                    <input
                      id="api-key-input"
                      type="password"
                      className="api-key-input"
                      placeholder="Enter your key..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <a
                    href="https://ai.google.dev/gemini-api/docs/quickstart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="api-key-link"
                  >
                    How to get an API key
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="chat-wrapper">
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <ResumeTemplate data={resumeData} />
      </main>

      {/* Right Sidebar */}
      <aside className="right-sidebar">
        <div className="right-sidebar-header">
          <h4>Actions</h4>
        </div>
        <div className="action-buttons-group">
          <button
            className="action-button"
            onClick={handleUploadClick}
            disabled={isExtracting}
          >
            {isExtracting ? (
              <LoaderCircle size={16} className="spinner" />
            ) : (
              <Upload size={16} />
            )}
            <span>{isExtracting ? "Extracting..." : "Upload CV"}</span>
          </button>
        </div>
        <div className="right-sidebar-footer">
          <p>Made by toilacube</p>
        </div>
      </aside>
    </div>
  );
}

export default App;
