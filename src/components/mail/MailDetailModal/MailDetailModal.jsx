import React, { useState } from 'react';
import Modal from '../../common/Modal/Modal';
import { Ship, Anchor, Phone, Mail, User, PhoneCall, MessageCircle, Trash, Linkedin, Users } from 'lucide-react';
import { cleanMail } from '../../../api/mailApi';
import './MailDetailModal.css';

/**
 * Mail Detail Modal
 */
const MailDetailModal = ({ isOpen, onClose, mail }) => {
    const [cleaning, setCleaning] = useState(false);

    if (!mail) return null;

    const handleClean = async () => {
        if (!window.confirm('您确定要清除提取的信息吗？')) {
            return;
        }

        setCleaning(true);
        try {
            await cleanMail(mail.id);
            onClose();
            // Optional: trigger a refresh in parent if needed, or rely on next open
        } catch (error) {
            console.error('Failed to clear mail info', error);
            alert('清除提取信息失败。');
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
                                <span className="mail-meta-label">发件人：</span>
                                <span className="mail-meta-value">{mail.sender}</span>
                            </div>
                            <div className="mail-meta-item">
                                <span className="mail-meta-label">收件人：</span>
                                <span className="mail-meta-value">{mail.toEmail || '我'}</span>
                            </div>
                            <div className="mail-meta-item">
                                <span className="mail-meta-label">日期：</span>
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
                                    {cleaning ? '清除中...' : '清除信息'}
                                </button>
                            </div>

                            <div className="mail-extracted-section">
                                {/* Extracted Ships */}
                                {mail.extractedShipsInfo?.length > 0 && (
                                    <div className="extracted-group">
                                        <h3 className="extracted-title">
                                            <Ship size={18} />
                                            提取的船舶信息
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
                                                                {/* Helper to render a schedule row */}
                                                                {(item.open_port || item.open_region || item.open_laycan) && (
                                                                    <div className="schedule-row-group">
                                                                        <div className="schedule-row">
                                                                            <Anchor size={14} className="icon-muted" />
                                                                            <span className="label">OPEN 位置：</span>
                                                                            <span className="port-name">{item.open_port || item.open_region || '-'}</span>
                                                                        </div>
                                                                        <div className="schedule-row">
                                                                            <span className="label">OPEN 日期：</span>
                                                                            <span className="value">{item.open_laycan || '-'}</span>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {(item.eta_port || item.eta_region || item.eta_laycan) && (
                                                                    <div className="schedule-row-group" style={{ marginTop: (item.open_port || item.open_laycan) ? '4px' : '0' }}>
                                                                        <div className="schedule-row">
                                                                            <Anchor size={14} className="icon-muted" />
                                                                            <span className="label">ETA 位置：</span>
                                                                            <span className="port-name">{item.eta_port || item.eta_region || '-'}</span>
                                                                        </div>
                                                                        <div className="schedule-row">
                                                                            <span className="label">ETA 日期：</span>
                                                                            <span className="value">{item.eta_laycan || '-'}</span>
                                                                        </div>
                                                                    </div>
                                                                )}

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
                                            提取的联系信息
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
                                                        {contact.teams && (
                                                            <div className="contact-row">
                                                                <Users size={14} />
                                                                <a href={contact.teams} target="_blank" rel="noopener noreferrer">Teams Link</a>
                                                            </div>
                                                        )}
                                                        {contact.linkedin && (
                                                            <div className="contact-row">
                                                                <Linkedin size={14} />
                                                                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a>
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
