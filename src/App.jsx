// src/App.jsx
import React from 'react';
import { Download, Bot, FileJson } from 'lucide-react';

import { useResumeData } from './hooks/useResumeData';
import { useChat } from './hooks/useChat';
import { generatePDF } from './utils/pdfUtils';
import { validateResumeData } from './utils/resumeValidator';

import ResumeTemplate from './components/ResumeTemplate';
import ChatInterface from './components/ChatInterface';
// We'll create JsonEditor later if needed, for now focus on the core

import './styles/App.css';
function App() {
  const { resumeData, updateResumeData } = useResumeData();
  const { messages, isLoading, sendMessage } = useChat(
    (newCvData) => {
      const error = validateResumeData(newCvData);
      if (error) {
        // You can add a new message to the chat here informing the user of the validation error
        console.error("Validation Error:", error);
      } else {
        updateResumeData(newCvData);
      }
    },
    resumeData
  );

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Bot size={24} />
          <h2>CV Assistant</h2>
        </div>
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
        />
        <div className="sidebar-footer">
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