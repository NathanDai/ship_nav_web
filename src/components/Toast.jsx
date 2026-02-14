
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} className="toast-icon success" />,
        error: <XCircle size={20} className="toast-icon error" />,
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                {icons[type]}
                <span className="toast-message">{message}</span>
            </div>
            <button className="toast-close" onClick={onClose}>
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
