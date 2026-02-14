import { useState, useCallback } from 'react';

/**
 * Toast 通知管理 Hook
 * @returns {object} { toast, showToast, hideToast }
 */
export const useToast = () => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return {
        toast,
        showToast,
        hideToast
    };
};
