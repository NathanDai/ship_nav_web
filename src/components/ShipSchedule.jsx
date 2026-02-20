import React, { useState } from 'react';
import { Search, Ship, AlertCircle } from 'lucide-react';
import { useShipSchedule } from '../hooks/useShipSchedule';
import { useModal, useShipDetails, useToast } from '../hooks';
import Pagination from './Pagination';
import ShipInfoModal, { ShipDetailModal } from './mail/ShipInfoModal/ShipInfoModal';
import MailDetailModal from './mail/MailDetailModal/MailDetailModal';
import { getMailDetail } from '../api/mailApi';
import Toast from './Toast';
import './common/Table.css';
import './common/Button.css';
import './ShipSchedule.css';

const ShipScheduleRow = ({ item, index, onViewShipDetails, onViewMailDetails }) => {
    const scheduleList = item.schedule && item.schedule.length > 0 ? item.schedule : [null];
    const currentYear = new Date().getFullYear();
    const buildYear = parseInt(item.year_of_build, 10);
    const age = !isNaN(buildYear) ? currentYear - buildYear : null;

    return (
        <React.Fragment>
            {scheduleList.map((scheduleItem, sIndex) => (
                <tr key={`${index}-${sIndex}`} className={sIndex === 0 ? 'ship-row-start' : ''}>
                    {sIndex === 0 && (
                        <>
                            <td rowSpan={scheduleList.length} className="vessel-cell">
                                <div className="subject-text">{item.vessel_name}</div>
                            </td>
                            <td rowSpan={scheduleList.length} className="imo-cell">
                                <div
                                    className="link-text"
                                    onClick={() => onViewShipDetails(item.imo)}
                                    title="点击查看船舶详情"
                                >
                                    {item.imo}
                                </div>
                            </td>
                            <td rowSpan={scheduleList.length} className="type-cell">
                                {item.vessel_type || '-'}
                            </td>
                            <td rowSpan={scheduleList.length} className="dwt-cell">
                                {item.deadweight || '-'}
                            </td>
                            <td rowSpan={scheduleList.length} className="built-cell">
                                {item.year_of_build ? (age !== null ? `${item.year_of_build} (${age}年)` : item.year_of_build) : '-'}
                            </td>
                            <td rowSpan={scheduleList.length} className="date-cell">
                                <div className="text-secondary">{item.time_date}</div>
                            </td>
                        </>
                    )}
                    <td className="schedule-cell-content">
                        {scheduleItem ? (scheduleItem.open_laycan || '-') : '-'}
                    </td>
                    <td className="schedule-cell-content">
                        {scheduleItem ? (scheduleItem.open_port || scheduleItem.open_region || '-') : '-'}
                    </td>
                    <td className="schedule-cell-content">
                        {scheduleItem ? (scheduleItem.eta_laycan || '-') : '-'}
                    </td>
                    <td className="schedule-cell-content">
                        {scheduleItem ? (scheduleItem.eta_port || scheduleItem.eta_region || '-') : '-'}
                    </td>
                    <td className="schedule-cell-content">
                        {scheduleItem ? (scheduleItem.trade_intent || '-') : '-'}
                    </td>
                    <td className="schedule-cell-content">
                        {scheduleItem ? (scheduleItem.remark || '-') : '-'}
                    </td>
                    {sIndex === 0 && (
                        <td rowSpan={scheduleList.length} className="action-cell">
                            <button
                                className="btn-ghost btn-sm"
                                onClick={() => onViewMailDetails(item.mail_id)}
                            >
                                详情
                            </button>
                        </td>
                    )}
                </tr>
            ))}
        </React.Fragment>
    );
};

const ShipSchedule = () => {
    const {
        schedules,
        loading,
        error,
        page,
        pageSize,
        total,
        vesselName,
        imo,
        setPage,
        setVesselName,
        setImo,
        searchSchedules
    } = useShipSchedule();

    // Local state for search inputs
    const [localVesselName, setLocalVesselName] = useState(vesselName);
    const [localImo, setLocalImo] = useState(imo);

    const shipDetailModal = useModal();
    const mailDetailModal = useModal();
    const { fetchShipDetails } = useShipDetails();
    const { toast, showToast, hideToast } = useToast();

    const handleViewShipDetails = async (imo) => {
        const result = await fetchShipDetails(imo, true);
        if (result.success) {
            shipDetailModal.openModal(result.data);
        } else {
            showToast('获取船舶详情失败', 'error');
        }
    };

    const handleViewMailDetails = async (mailId) => {
        try {
            const data = await getMailDetail(mailId);
            mailDetailModal.openModal(data);
        } catch (err) {
            console.error('加载邮件详情失败', err);
            showToast('加载邮件详情失败', 'error');
        }
    };

    const handleLocalSearch = () => {
        searchSchedules(localVesselName, localImo);
    };

    return (
        <div className="ship-schedule-container">
            <div className="table-header">
                <div className="header-title">
                    <h2>船舶排期</h2>
                    <span className="mail-count">共 {total} 条</span>
                </div>
                <div className="table-controls">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="船名"
                            className="search-input"
                            value={localVesselName}
                            onChange={(e) => setLocalVesselName(e.target.value)}
                            style={{ width: '180px' }}
                        />
                    </div>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="IMO"
                            className="search-input"
                            value={localImo}
                            onChange={(e) => setLocalImo(e.target.value)}
                            style={{ width: '180px' }}
                        />
                    </div>
                    <button className="btn-primary" onClick={handleLocalSearch}>
                        <Search size={16} />
                        搜索
                    </button>
                </div>
            </div>

            <div className="table-wrapper">
                {error ? (
                    <div className="error-state">
                        <AlertCircle size={48} className="error-icon" />
                        <h3>出错了</h3>
                        <p>{error}</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '150px' }}>船名</th>
                                <th style={{ width: '100px' }}>IMO</th>
                                <th style={{ width: '100px' }}>船型</th>
                                <th style={{ width: '90px' }}>载重吨</th>
                                <th style={{ width: '110px' }}>建造年份(船龄)</th>
                                <th style={{ width: '140px' }}>收件时间</th>
                                <th style={{ width: '120px' }}>Open日期</th>
                                <th style={{ width: '120px' }}>Open位置</th>
                                <th style={{ width: '120px' }}>ETA日期</th>
                                <th style={{ width: '120px' }}>ETA位置</th>
                                <th style={{ width: '120px' }}>航线意向</th>
                                <th>备注</th>
                                <th style={{ width: '100px' }}>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="13" className="skeleton-cell">
                                            <div className="skeleton-line"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : schedules.length === 0 ? (
                                <tr>
                                    <td colSpan="13" className="empty-state">
                                        <div className="empty-content">
                                            <Ship size={48} />
                                            <p>未找到船期</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                schedules.map((item, index) => (
                                    <ShipScheduleRow
                                        key={index}
                                        item={item}
                                        index={index}
                                        onViewShipDetails={handleViewShipDetails}
                                        onViewMailDetails={handleViewMailDetails}
                                    />
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

            {/* Modals */}
            <ShipDetailModal
                isOpen={shipDetailModal.isOpen}
                onClose={shipDetailModal.closeModal}
                shipDetail={shipDetailModal.data}
            />
            <MailDetailModal
                isOpen={mailDetailModal.isOpen}
                onClose={mailDetailModal.closeModal}
                mail={mailDetailModal.data}
            />

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </div>
    );
};

export default ShipSchedule;
