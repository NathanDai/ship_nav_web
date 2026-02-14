import React, { useState, useEffect } from 'react';
import { MoreVertical, Star, Trash2, Copy, Edit, Mail, RotateCcw, AlertCircle, Package, Eye, X, Ship } from 'lucide-react';
import { fetchProducts, updateMail163, getMailSchedule, getShipDetails } from '../api'; // We'll keep using the existing API function for now
import './MailTable.css';
import Pagination from './Pagination';
import Toast from './Toast';

const MailTable = () => {
    const [mails, setMails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState([]);
    const [selectedMail, setSelectedMail] = useState(null);
    const [shipInfoModalData, setShipInfoModalData] = useState(null);
    const [shipDetailModalData, setShipDetailModalData] = useState(null);
    const [subject, setSubject] = useState(''); // Input value
    const [querySubject, setQuerySubject] = useState(''); // Value for API call
    const [refreshKey, setRefreshKey] = useState(0);
    const [toast, setToast] = useState(null); // { message, type }

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
    }, [page, pageSize, querySubject, refreshKey]); // triggering fetch when querySubject changes


    const handleRefresh = async () => {
        setLoading(true);
        setError(null);
        try {
            await updateMail163();
            setRefreshKey(prev => prev + 1);
            showToast('Emails updated successfully', 'success');
        } catch (err) {
            console.error(err);
            setError("Failed to update emails. Please try again.");
            setLoading(false);
            showToast('Failed to update emails', 'error');
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        // Auto-hide is handled by the Toast component itself via onClose callback, 
        // but we can also manage it here if we want multiple toasts. 
        // For simplicity, we just set the current toast.
    };



    const isSelectable = (status) => status === 0;

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            const selectableIds = mails.filter(m => isSelectable(m.status)).map(m => m.id);
            setSelected(selectableIds);
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

    const handleGetSchedule = async () => {
        if (selected.length === 0) return;
        try {
            const res = await getMailSchedule(selected);
            console.log('Schedule response:', res);
            if (res.code === 0) {
                showToast('Schedule extraction started successfully', 'success');
            } else {
                showToast(res.message || 'Failed to start schedule extraction', 'error');
            }
        } catch (error) {
            console.error('Failed to get schedule:', error);
            showToast('Failed to start schedule extraction', 'error');
        }
    };

    const handleGetShipDetails = async (imo) => {
        try {
            const res = await getShipDetails(imo);
            console.log('Ship details response:', res);
            if (res.code === 0) {
                setShipDetailModalData(res.data);
            } else {
                showToast(res.message || 'Failed to get ship details', 'error');
            }
        } catch (error) {
            console.error('Failed to get ship details:', error);
            showToast('Failed to get ship details', 'error');
        }
    };

    // Cleanup effect to restore scroll if component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="mail-table-container">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="table-header">
                <div className="header-title">
                    <h2>Inbox</h2>
                    <span className="mail-count">共 {total} 条</span>
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
                    <button className="btn-secondary" onClick={handleRefresh}>
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
                                        checked={mails.length > 0 && selected.length > 0 && mails.filter(m => isSelectable(m.status)).every(m => isSelected(m.id))}
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
                                                disabled={!isSelectable(mail.status)}
                                            />
                                        </td>
                                        <td className="td-star">
                                            {mail.status === 2 && (
                                                <button
                                                    className="star-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShipInfoModalData(mail.extracted_ships_info || []);
                                                    }}
                                                    title="View Ship Info"
                                                >
                                                    <Ship size={16} className="text-blue-500" />
                                                </button>
                                            )}
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
                        <div className="selected-count">{selected.length} 个选中</div>
                        <div className="toolbar-divider"></div>
                        <div className="toolbar-actions">
                            <button title="Archive" className="toolbar-btn" onClick={handleGetSchedule}><Package size={18} /></button>
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

            {
                shipInfoModalData && (
                    <div className="modal-overlay" onClick={() => setShipInfoModalData(null)}>
                        <div className="modal-content ship-info-modal" onClick={e => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={() => setShipInfoModalData(null)}>
                                <X size={24} />
                            </button>
                            <div className="mail-detail-container">
                                <h3 className="ship-info-title">提取的信息</h3>
                                {shipInfoModalData.length === 0 ? (
                                    <p>暂无船舶信息</p>
                                ) : (
                                    <div className="ship-list">
                                        {shipInfoModalData.map((ship, index) => (
                                            <div key={index} className="ship-item">
                                                <div className="ship-header">
                                                    <div>
                                                        <span className="ship-info-label">船舶名称:</span> {ship.vessel_name}
                                                    </div>
                                                    <div>
                                                        <span className="ship-info-label">IMO:</span> {ship.imo}
                                                        {ship.imo && (
                                                            <button
                                                                className="btn-link ml-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleGetShipDetails(ship.imo);
                                                                }}
                                                                style={{ marginLeft: '8px', padding: '2px 8px', fontSize: '12px', cursor: 'pointer', color: '#1677ff', border: 'none', background: 'none' }}
                                                            >
                                                                船舶详情
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ship-schedule">
                                                    <h4 className="ship-schedule-title">船期</h4>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>港口</th>
                                                                <th>装卸期</th>
                                                                <th>备注</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {ship.schedule && ship.schedule.map((sch, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{sch.port}</td>
                                                                    <td>{sch.laycan}</td>
                                                                    <td>{sch.remark || ''}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
            {
                shipDetailModalData && (
                    <div className="modal-overlay" onClick={() => setShipDetailModalData(null)}>
                        <div className="modal-content ship-info-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                            <button className="modal-close-btn" onClick={() => setShipDetailModalData(null)}>
                                <X size={24} />
                            </button>
                            <div className="mail-detail-container">
                                <h3 className="ship-info-title">船舶详情: {shipDetailModalData.vessel_name}</h3>
                                <div className="ship-detail-content" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                    <div className="ship-image" style={{ flex: '1 1 300px' }}>
                                        {shipDetailModalData.img_url ? (
                                            <img
                                                src={shipDetailModalData.img_url}
                                                alt={shipDetailModalData.vessel_name}
                                                style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                                                <Ship size={64} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="ship-info-grid" style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
                                        <div className="info-item">
                                            <div className="label" style={{ color: '#888', fontSize: '12px' }}>IMO Number</div>
                                            <div className="value" style={{ fontWeight: '500' }}>{shipDetailModalData.imo_number}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label" style={{ color: '#888', fontSize: '12px' }}>MMSI</div>
                                            <div className="value" style={{ fontWeight: '500' }}>{shipDetailModalData.mmsi}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label" style={{ color: '#888', fontSize: '12px' }}>Call Sign</div>
                                            <div className="value" style={{ fontWeight: '500' }}>{shipDetailModalData.callsign}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label" style={{ color: '#888', fontSize: '12px' }}>Vessel Type</div>
                                            <div className="value" style={{ fontWeight: '500' }}>{shipDetailModalData.vessel_type}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label" style={{ color: '#888', fontSize: '12px' }}>Year Built</div>
                                            <div className="value" style={{ fontWeight: '500' }}>{shipDetailModalData.year_of_build}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label" style={{ color: '#888', fontSize: '12px' }}>Flag</div>
                                            <div className="value" style={{ fontWeight: '500' }}>{shipDetailModalData.flag}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label" style={{ color: '#888', fontSize: '12px' }}>Length Overall</div>
                                            <div className="value" style={{ fontWeight: '500' }}>{shipDetailModalData.length_overall_m} m</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label" style={{ color: '#888', fontSize: '12px' }}>Beam</div>
                                            <div className="value" style={{ fontWeight: '500' }}>{shipDetailModalData.beam_m} m</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label" style={{ color: '#888', fontSize: '12px' }}>Gross Tonnage</div>
                                            <div className="value" style={{ fontWeight: '500' }}>{shipDetailModalData.gross_tonnage}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="label" style={{ color: '#888', fontSize: '12px' }}>Deadweight</div>
                                            <div className="value" style={{ fontWeight: '500' }}>{shipDetailModalData.deadweight} t</div>
                                        </div>
                                    </div>
                                </div>
                                {shipDetailModalData.vessel_url && (
                                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                        <a
                                            href={`https://www.vesselfinder.com${shipDetailModalData.vessel_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary"
                                            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            View on VesselFinder <Eye size={16} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default MailTable;
