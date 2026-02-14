import React from 'react';
import { User, Phone, Mail, Link as LinkIcon, Linkedin, MessageCircle } from 'lucide-react';
import Modal from '../../common/Modal/Modal';
import './ContactInfoModal.css';

const ContactInfoModal = ({ isOpen, onClose, contacts }) => {
    // if (!isOpen) return null; // Modal handles isOpen

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="contact-info-container">
                <div className="contact-info-title">
                    Extracted Contacts
                </div>

                {contacts && contacts.length > 0 ? (
                    <div className="contact-list">
                        {contacts.map((contact, index) => (
                            <div key={index} className="contact-card">
                                <div className="contact-card-header">
                                    <div className="contact-avatar">
                                        <User size={24} />
                                    </div>
                                    <div className="contact-info">
                                        <h3>{contact.name || 'Unknown Name'}</h3>
                                        <span className="contact-title">{contact.title || ''}</span>
                                    </div>
                                </div>

                                <div className="contact-card-details">
                                    {/* Emails */}
                                    {contact.email && contact.email.map((email, i) => (
                                        <div key={`email-${i}`} className="contact-detail-item">
                                            <Mail size={16} className="contact-detail-icon" />
                                            <div className="contact-detail-content">
                                                <a href={`mailto:${email}`} className="contact-detail-link">{email}</a>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Mobile/Phones */}
                                    {contact.mobile && contact.mobile.map((phone, i) => (
                                        <div key={`mobile-${i}`} className="contact-detail-item">
                                            <Phone size={16} className="contact-detail-icon" />
                                            <div className="contact-detail-content">
                                                <span>{phone}</span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Other Contacts */}
                                    {contact.wechat && (
                                        <div className="contact-detail-item">
                                            <MessageCircle size={16} className="contact-detail-icon text-green-500" />
                                            <div className="contact-detail-content">
                                                <span>WeChat: {contact.wechat}</span>
                                            </div>
                                        </div>
                                    )}
                                    {contact.whatsapp && (
                                        <div className="contact-detail-item">
                                            <MessageCircle size={16} className="contact-detail-icon text-green-600" />
                                            <div className="contact-detail-content">
                                                <span>WhatsApp: {contact.whatsapp}</span>
                                            </div>
                                        </div>
                                    )}
                                    {contact.teams && (
                                        <div className="contact-detail-item">
                                            <LinkIcon size={16} className="contact-detail-icon text-blue-600" />
                                            <div className="contact-detail-content">
                                                <a href={contact.teams} target="_blank" rel="noopener noreferrer" className="contact-detail-link">Teams Link</a>
                                            </div>
                                        </div>
                                    )}
                                    {contact.linkedin && (
                                        <div className="contact-detail-item">
                                            <Linkedin size={16} className="contact-detail-icon text-blue-700" />
                                            <div className="contact-detail-content">
                                                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-detail-link">LinkedIn Profile</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="contact-empty">
                        <User size={48} />
                        <p>No contact information found.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ContactInfoModal;
