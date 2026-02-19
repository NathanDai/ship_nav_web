import React, { useState } from 'react';
import Modal from '../../common/Modal/Modal';
import { Ship, Anchor, Phone, Mail, User, PhoneCall, MessageCircle, Trash } from 'lucide-react';
import { cleanMail } from '../../../api/mailApi';
import './MailDetailModal.css';

/**
 * Mail Detail Modal
 */
const MailDetailModal = ({ isOpen, onClose, mail }) => {
    const [cleaning, setCleaning] = useState(false);

    if (!mail) return null;

    const handleClean = async () => {
        if (!window.confirm('Are you sure you want to clear the extracted information?')) {
            return;
        }

        setCleaning(true);
        try {
            await cleanMail(mail.id);
            onClose();
            // Optional: trigger a refresh in parent if needed, or rely on next open
        } catch (error) {
            console.error('Failed to clear mail info', error);
            alert('Failed to clear extracted information.');
        } finally {
            setCleaning(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="detail-modal-fullscreen">
            <div className="mail-detail-container">
                <div className="mail-detail-subject">
                    {mail.subject}
                </div>

                <div className="mail-content-display">
                    {/* Left Column: Mail Content */}
                    <div className="mail-primary-column">
                        <div className="mail-meta-list">
                            <div className="mail-meta-item">
                                <span className="mail-meta-label">Sender:</span>
                                <span className="mail-meta-value">{mail.sender}</span>
                            </div>
                            <div className="mail-meta-item">
                                <span className="mail-meta-label">To:</span>
                                <span className="mail-meta-value">{mail.toEmail || 'Me'}</span>
                            </div>
                            <div className="mail-meta-item">
                                <span className="mail-meta-label">Date:</span>
                                <span className="mail-meta-value">{mail.date}</span>
                            </div>
                        </div>

                        <div className="mail-detail-body">
                            <pre>{mail.content}</pre>
                        </div>
                    </div>

                    {/* Right Column: Extracted Information */}
                    {(mail.extractedShipsInfo?.length > 0 || mail.extractedContactsInfo?.length > 0) && (
                        <div className="mail-secondary-column">
                            <div className="mail-extracted-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    className="btn-secondary"
                                    onClick={handleClean}
                                    disabled={cleaning}
                                    style={{
                                        color: 'var(--error-text)',
                                        borderColor: 'var(--error-bg)',
                                        background: 'transparent',
                                        fontSize: '12px',
                                        padding: '4px 10px',
                                        height: 'auto'
                                    }}
                                >
                                    <Trash size={14} />
                                    {cleaning ? 'Clearing...' : 'Clear Info'}
                                </button>
                            </div>

                            <div className="mail-extracted-section">
                                {/* Extracted Ships */}
                                {mail.extractedShipsInfo?.length > 0 && (
                                    <div className="extracted-group">
                                        <h3 className="extracted-title">
                                            <Ship size={18} />
                                            Extracted Ships
                                        </h3>
                                        <div className="ships-grid">
                                            {mail.extractedShipsInfo.map((ship, index) => (
                                                <div key={index} className="ship-card">
                                                    <div className="ship-card-header">
                                                        <div className="ship-name">{ship.vessel_name}</div>
                                                        <div className="ship-imo">IMO: {ship.imo}</div>
                                                    </div>
                                                    <div className="ship-schedules">
                                                        {ship.schedule?.map((item, idx) => (
                                                            <div key={idx} className="schedule-item">
                                                                <div className="schedule-row">
                                                                    <Anchor size={14} className="icon-muted" />
                                                                    <span className="port-name">{item.port}</span>
                                                                </div>
                                                                <div className="schedule-row">
                                                                    <span className="label">Laycan:</span>
                                                                    <span className="value">{item.laycan}</span>
                                                                </div>
                                                                {item.remark && (
                                                                    <div className="schedule-remark">{item.remark}</div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Extracted Contacts */}
                                {mail.extractedContactsInfo?.length > 0 && (
                                    <div className="extracted-group">
                                        <h3 className="extracted-title">
                                            <User size={18} />
                                            Extracted Contacts
                                        </h3>
                                        <div className="contacts-grid">
                                            {mail.extractedContactsInfo.map((contact, index) => (
                                                <div key={index} className="contact-card">
                                                    <div className="contact-header">
                                                        <div className="contact-name">{contact.name}</div>
                                                        {contact.title && <div className="contact-title">{contact.title}</div>}
                                                    </div>
                                                    <div className="contact-details">
                                                        {contact.email?.map((email, idx) => (
                                                            <div key={idx} className="contact-row">
                                                                <Mail size={14} />
                                                                <a href={`mailto:${email}`}>{email}</a>
                                                            </div>
                                                        ))}
                                                        {contact.mobile?.map((phone, idx) => (
                                                            <div key={idx} className="contact-row">
                                                                <Phone size={14} />
                                                                <span>{phone}</span>
                                                            </div>
                                                        ))}
                                                        {contact.wechat && (
                                                            <div className="contact-row">
                                                                <MessageCircle size={14} />
                                                                <span>WeChat: {contact.wechat}</span>
                                                            </div>
                                                        )}
                                                        {contact.whatsapp && (
                                                            <div className="contact-row">
                                                                <PhoneCall size={14} />
                                                                <span>WhatsApp: {contact.whatsapp}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default MailDetailModal;
