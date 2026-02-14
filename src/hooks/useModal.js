import { useState, useCallback } from 'react';

/**
 * Modal 状态管理 Hook
 * @returns {object} Modal 状态和操作方法
 */
export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState(null);

    const openModal = useCallback((modalData = null) => {
        setData(modalData);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setData(null);
        document.body.style.overflow = 'unset';
    }, []);

    return {
        isOpen,
        data,
        openModal,
        closeModal
    };
};
