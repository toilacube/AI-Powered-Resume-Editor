// src/components/ConfirmationModal.jsx
import React from 'react';
import '../styles/Modal.css';

const ConfirmationModal = ({ isOpen, jsonText, onJsonTextChange, onApply, onCancel, error }) => {
  if (!isOpen) {
    return null;
  }

  const handleApplyClick = () => {
    try {
      // Validate that the text is valid JSON before applying
      JSON.parse(jsonText);
      onApply(jsonText);
    } catch (e) {
      alert("The text is not valid JSON. Please correct it before applying.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Extracted Resume Data</h2>
        <p>Review and edit the extracted data below. Click "Apply" to replace your current resume.</p>
        
        <textarea
          className="modal-textarea"
          value={jsonText}
          onChange={(e) => onJsonTextChange(e.target.value)}
        />
        
        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-button apply" onClick={handleApplyClick}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
