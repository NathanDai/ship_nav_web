import React, { useState, useEffect } from 'react';
import { getQueueStatus } from '../../../api';
import './QueueStatus.css';

const QueueStatus = () => {
    const [status, setStatus] = useState({
        pending: 0,
        running: 0,
        workers: 10
    });

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await getQueueStatus();
                if (response) {
                    setStatus(response);
                }
            } catch (error) {
                console.error('Failed to fetch queue status:', error);
            }
        };

        // Initial fetch
        fetchStatus();

        // Poll every 3 seconds
        const interval = setInterval(fetchStatus, 3000);

        return () => clearInterval(interval);
    }, []);

    const { pending, running, workers } = status;
    const usage = workers > 0 ? (running / workers) * 100 : 0;

    // Determine color based on load
    let progressClass = 'progress-bar-fill';
    if (usage > 80) {
        progressClass += ' warning';
    } else {
        progressClass += ' success';
    }

    return (
        <div className="queue-status-container">
            <div className="queue-stats">
                <div className="stat-item">
                    <span>Pending:</span>
                    <span className="stat-value">{pending}</span>
                </div>
                <div className="stat-item">
                    <span>Running:</span>
                    <span className="stat-value">{running} / {workers}</span>
                </div>
            </div>
            <div className="progress-bar-bg">
                <div
                    className={progressClass}
                    style={{ width: `${Math.min(usage, 100)}%` }}
                />
            </div>
        </div>
    );
};

export default QueueStatus;
