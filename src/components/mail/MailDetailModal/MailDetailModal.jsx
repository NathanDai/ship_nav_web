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

                <div className="mail-meta-header">
                    <div className="sender-avatar">
                        {mail.sender.charAt(0).toUpperCase()}
                    </div>
                    <div className="meta-info-col">
                        <div className="sender-recipient-row">
                            <span className="sender-name">{mail.sender}</span>
                            <span className="meta-separator">发送给</span>
                            <span className="recipient-name">{mail.toEmail || '我'}</span>
                        </div>
                        <div className="meta-date-mobile">{mail.date}</div>
                    </div>
                    <div className="meta-date">
                        {mail.date}
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
