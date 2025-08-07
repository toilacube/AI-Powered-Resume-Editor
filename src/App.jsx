import React, { useState, useEffect } from "react";
import {
  Download,
  Bot,
  KeyRound,
  ChevronDown,
  ChevronUp,
  History,
  Upload,
  LoaderCircle,
} from "lucide-react";
import { applyPatch } from "fast-json-patch";

import { useResumeHistory } from "./hooks/useResumeHistory";
import { useChat } from "./hooks/useChat";
import { generatePDF } from "./utils/pdfUtils";
import { validateResumeData } from "./utils/resumeValidator";
import { extractDataFromPdf } from "./utils/openaiService";
import ConfirmationModal from "./components/ConfirmationModal";

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

  // State for file upload and modal
  const fileInputRef = React.useRef(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    jsonText: "",
    error: null,
  });

  // Handle file upload click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection and extraction
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
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
      // Reset file input to allow uploading the same file again
      event.target.value = null;
    }
  };

  // Handle modal apply
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

  // Handle modal cancel
  const handleModalCancel = () => {
    setModalState({ isOpen: false, jsonText: "", error: null });
  };

  // Handle modal JSON change
  const handleModalJsonChange = (newJsonText) => {
    setModalState((prev) => ({ ...prev, jsonText: newJsonText, error: null }));
  };

  return (
    <div className="app-container">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        style={{ display: "none" }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        jsonText={modalState.jsonText}
        onJsonTextChange={handleModalJsonChange}
        onApply={() => handleModalApply(modalState.jsonText)}
        onCancel={handleModalCancel}
        error={modalState.error}
      />

      <aside className="sidebar">
        <div className="sidebar-header">
          <Bot size={24} />
          <h3>CV Assistant</h3>
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

                {/* Hyper link to how to get the api key */}
                <a
                  href="https://ai.google.dev/gemini-api/docs/quickstart#:~:text=You%20need%20a%20Gemini%20API%20key.%20If%20you%20don%27t%20already%20have%20one%2C%20you%20can%20get%20it%20for%20free%20in%20Google%20AI%20Studio."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  How to get the api key
                </a>
              </div>
            )}
          </div>
          <div className="action-buttons-group">
            <button
              className="action-button upload"
              onClick={handleUploadClick}
              disabled={isExtracting}
            >
              {isExtracting ? (
                <LoaderCircle size={16} className="spinner" />
              ) : (
                <Upload size={16} />
              )}
              {isExtracting ? "Extracting..." : "Upload CV"}
            </button>
            <button
              className="action-button download"
              onClick={() => generatePDF()}
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <ResumeTemplate data={resumeData} />
      </main>
    </div>
  );
}

export default App;
