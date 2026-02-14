import React from 'react';
import Modal from '../../common/Modal/Modal';
import './MailDetailModal.css';

/**
 * 邮件详情 Modal
 */
const MailDetailModal = ({ isOpen, onClose, mail }) => {
    if (!mail) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="mail-detail-container">
                <div className="mail-detail-subject">
                    {mail.subject}
                </div>

                <div className="mail-meta-list">
                    <div className="mail-meta-item">
                        <span className="mail-meta-label">发件人：</span>
                        <span className="mail-meta-value">{mail.sender}</span>
                    </div>
                    <div className="mail-meta-item">
                        <span className="mail-meta-label">收件人：</span>
                        <span className="mail-meta-value">{mail.toEmail || '我'}</span>
                    </div>
                    <div className="mail-meta-item">
                        <span className="mail-meta-label">时　间：</span>
                        <span className="mail-meta-value">{mail.date}</span>
                    </div>
                </div>

                <div className="mail-detail-body">
                    <pre>{mail.content}</pre>
                </div>
            </div>
        </Modal>
    );
};

export default MailDetailModal;
