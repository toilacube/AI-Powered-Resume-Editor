
import React from 'react';
import '../styles/HistoryPanel.css'; // The stylesheet will also be updated

const HistoryPanel = ({ history, onApplyVersion }) => {
    // The history is already sorted in the parent, but sorting again ensures consistency
    const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const formatTimestamp = (isoString) => {
        // A cleaner, more readable date format
        return new Date(isoString).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        // This is now the scrollable container
        <div className="history-list-container">
            {sortedHistory.map((item) => (
                <div key={item.timestamp} className="history-item">
                    <div className="history-details">
                        <span className="history-message" title={item.message}>
                            {item.message}
                        </span>
                        <span className="history-timestamp">
                            {formatTimestamp(item.timestamp)}
                        </span>
                    </div>
                    <div className="history-action">
                        {item.isLatest ? (
                            <span className="latest-label">Latest</span>
                        ) : (
                            <button
                                className="apply-button"
                                onClick={() => onApplyVersion(item.timestamp)}
                            >
                                Revert
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryPanel;