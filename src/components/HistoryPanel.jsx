import React from 'react';
import '../styles/HistoryPanel.css';

const HistoryPanel = ({ history, onApplyVersion }) => {
    const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const formatTimestamp = (isoString) => {
        return new Date(isoString).toLocaleString();
    };

    return (
        <div className="history-panel">
            <h4>Change History</h4>
            <div className="history-table-container">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Change</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedHistory.map((item) => (
                            <tr key={item.timestamp}>
                                <td>{formatTimestamp(item.timestamp)}</td>
                                <td className="history-message" title={item.message}>{item.message}</td>
                                <td>
                                    {item.isLatest ? (
                                        <span className="latest-label">Latest</span>
                                    ) : (
                                        <button
                                            className="apply-button"
                                            onClick={() => onApplyVersion(item.timestamp)}
                                        >
                                            Apply
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryPanel;
