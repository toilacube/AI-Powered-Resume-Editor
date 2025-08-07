import { useState, useEffect, useCallback } from 'react';
import initialData from '../data/resumeData.json';

const HISTORY_STORAGE_KEY = 'resumeHistory';

export const useResumeHistory = () => {
    const [history, setHistory] = useState(() => {
        const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (savedHistory) {
            return JSON.parse(savedHistory);
        }
        return [{
            snapshot: initialData,
            timestamp: new Date().toISOString(),
            message: 'Initial version',
            isLatest: true,
        }];
    });

    const [resumeData, setResumeData] = useState(() => {
        const latestVersion = history.find(h => h.isLatest);
        return latestVersion ? latestVersion.snapshot : initialData;
    });

    useEffect(() => {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        const latestVersion = history.find(h => h.isLatest);
        if (latestVersion) {
            setResumeData(JSON.parse(JSON.stringify(latestVersion.snapshot)));
        }
    }, [history]);

    const updateResumeAndCreateHistory = useCallback((newSnapshot, userMessage) => {
        setHistory(prevHistory => {
            const updatedHistory = prevHistory.map(h => ({ ...h, isLatest: false }));
            
            return [
                ...updatedHistory,
                {
                    snapshot: newSnapshot,
                    timestamp: new Date().toISOString(),
                    message: userMessage,
                    isLatest: true,
                }
            ];
        });
    }, []);

    const applyHistoryVersion = useCallback((timestampToApply) => {
        setHistory(prevHistory => {
            return prevHistory.map(h => ({
                ...h,
                isLatest: h.timestamp === timestampToApply
            }));
        });
    }, []);

    return {
        resumeData,
        history,
        updateResumeAndCreateHistory,
        applyHistoryVersion,
    };
};
