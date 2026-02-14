import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

/**
 * 通用 Modal 组件
 * @param {boolean} isOpen - 是否打开
 * @param {Function} onClose - 关闭回调
 * @param {ReactNode} children - 子元素
 * @param {string} className - 自定义类名
 * @param {object} style - 自定义样式
 */
const Modal = ({ isOpen, onClose, children, className = '', style = {} }) => {
    // 清理副作用
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal-content ${className}`}
                onClick={e => e.stopPropagation()}
                style={style}
            >
                <button className="modal-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
