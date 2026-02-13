import React, { useState, useEffect } from 'react';
import { MoreVertical, Star, Trash2, Copy, Edit, Mail, RotateCcw, AlertCircle, Package, Eye, X } from 'lucide-react';
import { fetchProducts } from '../api'; // We'll keep using the existing API function for now
import './MailTable.css';
import Pagination from './Pagination';

const MailTable = () => {
    const [mails, setMails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState([]);
    const [selectedMail, setSelectedMail] = useState(null);
    const [subject, setSubject] = useState(''); // Input value
    const [querySubject, setQuerySubject] = useState(''); // Value for API call

    useEffect(() => {
        let ignore = false;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Pass querySubject to fetchProducts
                const response = await fetchProducts(page, pageSize, querySubject);
                if (!ignore) {
                    setMails(response.data);
                    setTotal(response.total);
                }
            } catch (err) {
                console.error("Failed to load mails", err);
                if (!ignore) {
                    setError("Failed to load emails. Please try again.");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchData();

        return () => {
            ignore = true;
        };
        return () => {
            ignore = true;
        };
    }, [page, pageSize, querySubject]); // triggering fetch when querySubject changes

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelected(mails.map(m => m.id));
        } else {
            setSelected([]);
        }
    };

    const toggleSelect = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const isSelected = (id) => selected.includes(id);

    const getStatusBadge = (status) => {
        let className = 'badge';
        let label = '';

        switch (status) {
            case 0: // Unprocessed
                className += ' badge-red';
                label = '未处理';
                break;
            case 1: // Pending
                className += ' badge-yellow';
                label = '待处理';
                break;
            case 2: // Processed
                className += ' badge-green';
                label = '已处理';
                break;
            default:
                className += ' badge-gray';
                label = '未知';
                break;
        }

        return (
            <span className={className}>
                <span className="badge-dot"></span>
                {label}
            </span>
        );
    };

    const handleViewDetails = (mail) => {
        setSelectedMail(mail);
        document.body.style.overflow = 'hidden';
    };

    const closeDetails = () => {
        setSelectedMail(null);
        document.body.style.overflow = 'unset';
    };

    // Cleanup effect to restore scroll if component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="mail-table-container">
            <div className="table-header">
                <div className="header-title">
                    <h2>Inbox</h2>
                    <span className="mail-count">{total} messages</span>
                </div>
                <div className="table-controls">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="查询邮件"
                            className="search-input"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <button className="btn-secondary" onClick={() => window.location.reload()}>
                        <RotateCcw size={16} />
                        刷新
                    </button>
                    <button className="btn-primary" onClick={() => {
                        setPage(1);
                        setQuerySubject(subject);
                    }}>
                        查询
                    </button>
                </div>
            </div>

            <div className="table-wrapper">
                {error ? (
                    <div className="error-state">
                        <AlertCircle size={48} className="error-icon" />
                        <h3>Something went wrong</h3>
                        <p>{error}</p>
                        <button className="btn-secondary" onClick={() => window.location.reload()}>Reload Page</button>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th className="th-checkbox">
                                    <input
                                        type="checkbox"
                                        onChange={toggleSelectAll}
                                        checked={mails.length > 0 && selected.length === mails.length}
                                    />
                                </th>
                                <th className="th-star"></th>
                                <th className="th-subject">主题</th>
                                <th className="th-sender">发件人</th>
                                <th className="th-date">日期</th>
                                <th className="th-status">状态</th>
                                <th className="th-action"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="7" className="skeleton-cell">
                                            <div className="skeleton-line"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : mails.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-state">
                                        <div className="empty-content">
                                            <Mail size={48} />
                                            <p>No emails found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                mails.map(mail => (
                                    <tr key={mail.id} className={isSelected(mail.id) ? 'selected-row' : ''}>
                                        <td className="td-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={isSelected(mail.id)}
                                                onChange={() => toggleSelect(mail.id)}
                                            />
                                        </td>
                                        <td className="td-star">
                                            <button className="star-btn">
                                                <Star size={16} />
                                            </button>
                                        </td>
                                        <td className="td-subject">
                                            <div className="subject-text">{mail.subject}</div>
                                        </td>
                                        <td className="td-sender">
                                            <div className="sender-text">{mail.sender}</div>
                                        </td>
                                        <td className="td-date">{mail.date}</td>
                                        <td className="td-status">{getStatusBadge(mail.status)}</td>
                                        <td className="td-action">
                                            <button className="action-btn" onClick={() => handleViewDetails(mail)} title="View Details">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
            />

            {
                selected.length > 0 && (
                    <div className="floating-toolbar">
                        <div className="selected-count">{selected.length} selected</div>
                        <div className="toolbar-divider"></div>
                        <div className="toolbar-actions">
                            <button title="Archive" className="toolbar-btn"><Package size={18} /></button>
                            <button title="Mark as Read" className="toolbar-btn"><Mail size={18} /></button>
                            <button title="Delete" className="toolbar-btn btn-delete"><Trash2 size={18} /></button>
                        </div>
                    </div>
                )
            }

            {
                selectedMail && (
                    <div className="modal-overlay" onClick={closeDetails}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={closeDetails}>
                                <X size={24} />
                            </button>

                            <div className="mail-detail-container">
                                <div className="mail-detail-subject">
                                    {selectedMail.subject}
                                </div>

                                <div className="mail-meta-header">
                                    <div className="sender-avatar">
                                        {selectedMail.sender.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="meta-info-col">
                                        <div className="sender-recipient-row">
                                            <span className="sender-name">{selectedMail.sender}</span>
                                            <span className="meta-separator">发送给</span>
                                            <span className="recipient-name">{selectedMail.to_email || '我'}</span>
                                        </div>
                                        <div className="meta-date-mobile">{selectedMail.date}</div>
                                    </div>
                                    <div className="meta-date">
                                        {selectedMail.date}
                                    </div>
                                </div>

                                <div className="mail-detail-body">
                                    <pre>{selectedMail.content}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default MailTable;
