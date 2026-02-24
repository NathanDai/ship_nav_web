import React, { useState } from 'react';
import { Search, Ship, AlertCircle } from 'lucide-react';
import { useShipPlan } from '../hooks/useShipPlan';
import { useModal, useShipDetails, useToast } from '../hooks';
import Pagination from './Pagination';
import ShipInfoModal, { ShipDetailModal } from './mail/ShipInfoModal/ShipInfoModal';
import MailDetailModal from './mail/MailDetailModal/MailDetailModal';
import { getMailDetail } from '../api/mailApi';
import Toast from './Toast';
import './common/Table.css';
import './common/Button.css';
import './ShipSchedule.css'; // Reusing the same CSS as ShipSchedule

const ShipPlanRow = ({ item, index, onViewShipDetails, onViewMailDetails }) => {
    const currentYear = new Date().getFullYear();
    const buildYear = parseInt(item.year_of_build, 10);
    const age = !isNaN(buildYear) ? currentYear - buildYear : null;

    return (
        <React.Fragment>
            <tr key={`${index}`} className="ship-row-start">
                <td className="vessel-cell">
                    <div className="subject-text">{item.vessel_name || '-'}</div>
                    <div
                        className="link-text"
                        onClick={() => onViewShipDetails(item.imo)}
                        title="点击查看船舶详情"
                        style={{ marginTop: '4px', fontSize: '0.9em' }}
                    >
                        {item.imo || '-'}
                    </div>
                </td>
                <td className="type-cell">
                    {item.vessel_type || '-'}
                </td>
                <td className="dwt-cell">
                    {item.deadweight || '-'}
                </td>
                <td className="length-cell">
                    {item.length_overall_m || '-'}
                </td>
                <td className="beam-cell">
                    {item.beam_m || '-'}
                </td>
                <td className="built-cell">
                    {item.year_of_build ? (age !== null ? `${item.year_of_build} (${age}年)` : item.year_of_build) : '-'}
                </td>
                <td className="date-cell">
                    <div className="text-secondary">{item.time_date || '-'}</div>
                </td>

                <td className="schedule-cell-content">
                    {[item.open_laycan_start, item.open_laycan_end].filter(Boolean).join(' ~ ') || '-'}
                </td>
                <td className="schedule-cell-content">
                    {item.open_port || item.open_region || '-'}
                </td>
                <td className="schedule-cell-content">
                    {[item.eta_laycan_start, item.eta_laycan_end].filter(Boolean).join(' ~ ') || '-'}
                </td>
                <td className="schedule-cell-content">
                    {item.eta_port || item.eta_region || '-'}
                </td>
                <td className="schedule-cell-content">
                    {item.trade_intent || '-'}
                </td>
                <td className="action-cell">
                    <button
                        className="btn-ghost btn-sm"
                        onClick={() => onViewMailDetails(item.mail_id)}
                    >
                        详情
                    </button>
                </td>
            </tr>
        </React.Fragment>
    );
};

const ShipPlan = () => {
    const {
        plans,
        loading,
        error,
        page,
        pageSize,
        total,
        vesselName,
        imo,
        openLaycan,
        openPort,
        setPage,
        setVesselName,
        setImo,
        setOpenLaycan,
        setOpenPort,
        searchPlans
    } = useShipPlan();

    // Local state for search inputs
    const [localVesselName, setLocalVesselName] = useState(vesselName);
    const [localImo, setLocalImo] = useState(imo);
    const [localOpenLaycan, setLocalOpenLaycan] = useState(openLaycan);
    const [localOpenPort, setLocalOpenPort] = useState(openPort);

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
        searchPlans(localVesselName, localImo, localOpenLaycan, localOpenPort);
    };

    return (
        <div className="ship-schedule-container">
            <div className="table-header">
                <div className="header-title">
                    <h2>船舶计划</h2>
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
                    <div className="search-wrapper">
                        <input
                            type="date"
                            className="search-input"
                            value={localOpenLaycan}
                            onChange={(e) => setLocalOpenLaycan(e.target.value)}
                            style={{ width: '180px' }}
                            title="Open日期"
                        />
                    </div>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Open位置"
                            className="search-input"
                            value={localOpenPort}
                            onChange={(e) => setLocalOpenPort(e.target.value)}
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
                                <th style={{ minWidth: '150px' }}>船名/IMO</th>
                                <th style={{ minWidth: '100px' }}>船型</th>
                                <th style={{ minWidth: '120px' }}>载重吨(吨)</th>
                                <th style={{ minWidth: '90px' }}>总长(m)</th>
                                <th style={{ minWidth: '90px' }}>型宽(m)</th>
                                <th style={{ minWidth: '110px' }}>建造年份(船龄)</th>
                                <th style={{ minWidth: '140px' }}>收件时间</th>
                                <th style={{ minWidth: '120px' }}>Open日期</th>
                                <th style={{ minWidth: '120px' }}>Open位置</th>
                                <th style={{ minWidth: '120px' }}>ETA日期</th>
                                <th style={{ minWidth: '120px' }}>ETA位置</th>
                                <th style={{ minWidth: '120px' }}>航线意向</th>
                                <th style={{ minWidth: '100px' }}>操作</th>
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
                            ) : plans.length === 0 ? (
                                <tr>
                                    <td colSpan="13" className="empty-state">
                                        <div className="empty-content">
                                            <Ship size={48} />
                                            <p>未找到船舶计划</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                plans.map((item, index) => (
                                    <ShipPlanRow
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

export default ShipPlan;
