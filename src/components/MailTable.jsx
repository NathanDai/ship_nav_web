import React from 'react';
import { MoreVertical, Ship, AlertCircle, Mail, RotateCcw, CalendarClock, Users } from 'lucide-react';
import { useMails, useSelection, useToast, useModal, useShipDetails } from '../hooks';
import { isMailSelectable } from '../constants/mailStatus';
import Badge from './common/Badge/Badge';
import MailDetailModal from './mail/MailDetailModal/MailDetailModal';
import ShipInfoModal, { ShipDetailModal } from './mail/ShipInfoModal/ShipInfoModal';
import Pagination from './Pagination';
import Toast from './Toast';
import './MailTable.css';

const MailTable = () => {
    // 使用自定义 Hooks
    const {
        mails,
        loading,
        error,
        page,
        pageSize,
        total,
        subject,
        setPage,
        setSubject,
        refreshMails,
        searchMails,
        fetchSchedule,
        fetchContact,
    } = useMails();

    const { selected, toggleSelectAll, toggleSelect, isSelected, isAllSelected } = useSelection(mails, isMailSelectable);
    const { toast, showToast, hideToast } = useToast();
    const mailDetailModal = useModal();
    const shipInfoModal = useModal();
    const shipDetailModal = useModal();
    const { fetchShipDetails } = useShipDetails();

    // 处理刷新
    const handleRefresh = async () => {
        const result = await refreshMails();
        if (result.success) {
            showToast('Emails updated successfully', 'success');
        } else {
            showToast('Failed to update emails', 'error');
        }
    };

    // 处理获取船期
    const handleGetSchedule = async () => {
        const selectedMails = mails.filter(mail => selected.includes(mail.id));
        const idsToProcess = selectedMails
            .filter(mail => mail.emailStatus === 0)
            .map(mail => mail.id);

        if (idsToProcess.length === 0) {
            showToast('No emails available for schedule extraction (Status must be 0)', 'info');
            return;
        }

        const result = await fetchSchedule(idsToProcess);
        if (result.success) {
            showToast(`Schedule extraction started for ${idsToProcess.length} emails`, 'success');
        } else {
            showToast('Failed to start schedule extraction', 'error');
        }
    };

    // 处理获取联系人
    const handleGetContact = async () => {
        const selectedMails = mails.filter(mail => selected.includes(mail.id));
        const idsToProcess = selectedMails
            .filter(mail => mail.contactStatus === 0)
            .map(mail => mail.id);

        if (idsToProcess.length === 0) {
            showToast('No emails available for contact extraction (Status must be 0)', 'info');
            return;
        }

        const result = await fetchContact(idsToProcess);
        if (result.success) {
            showToast(`Contact extraction started for ${idsToProcess.length} emails`, 'success');
        } else {
            showToast('Failed to start contact extraction', 'error');
        }
    };

    // 处理查看船舶详情
    const handleViewShipDetails = async (imo) => {
        const result = await fetchShipDetails(imo);
        if (result.success) {
            shipDetailModal.openModal(result.data);
        } else {
            showToast('Failed to get ship details', 'error');
        }
    };

    return (
        <div className="mail-table-container">
            {/* Toast 通知 */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            {/* 表头 */}
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
                    <button className="btn-primary" onClick={searchMails}>
                        查询
                    </button>
                </div>
            </div>

            {/* 表格 */}
            <div className="table-wrapper">
                {error ? (
                    <div className="error-state">
                        <AlertCircle size={48} className="error-icon" />
                        <h3>Something went wrong</h3>
                        <p>{error}</p>
                        <button className="btn-secondary" onClick={() => window.location.reload()}>
                            Reload Page
                        </button>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th className="th-checkbox">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => toggleSelectAll(e.target.checked)}
                                        checked={isAllSelected()}
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
                                            {mail.emailStatus === 2 && (
                                                <button
                                                    className="star-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        shipInfoModal.openModal(mail.extractedShipsInfo || []);
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
                                        <td className="td-status">
                                            <Badge status={mail.emailStatus} />
                                        </td>
                                        <td className="td-action">
                                            <button
                                                className="action-btn"
                                                onClick={() => mailDetailModal.openModal(mail)}
                                                title="View Details"
                                            >
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

            {/* 分页 */}
            <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
            />

            {/* 浮动工具栏 */}
            {selected.length > 0 && (
                <div className="floating-toolbar">
                    <div className="selected-count">{selected.length} 个选中</div>
                    <div className="toolbar-divider"></div>
                    <div className="toolbar-actions">
                        <button title="获取船期" className="toolbar-btn" onClick={handleGetSchedule}>
                            <CalendarClock size={18} />
                        </button>
                        <button title="获取联系人" className="toolbar-btn" onClick={handleGetContact}>
                            <Users size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <MailDetailModal
                isOpen={mailDetailModal.isOpen}
                onClose={mailDetailModal.closeModal}
                mail={mailDetailModal.data}
            />

            <ShipInfoModal
                isOpen={shipInfoModal.isOpen}
                onClose={shipInfoModal.closeModal}
                ships={shipInfoModal.data}
                onViewDetails={handleViewShipDetails}
            />

            <ShipDetailModal
                isOpen={shipDetailModal.isOpen}
                onClose={shipDetailModal.closeModal}
                shipDetail={shipDetailModal.data}
            />
        </div>
    );
};

export default MailTable;
