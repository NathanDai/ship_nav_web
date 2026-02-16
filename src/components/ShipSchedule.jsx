import React, { useEffect } from 'react';
import { Search, Ship } from 'lucide-react';
import { useShipSchedule } from '../hooks/useShipSchedule';
import Pagination from './Pagination';
import './ShipSchedule.css';

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
        handleSearch
    } = useShipSchedule();

    // Local state for search inputs
    const [localVesselName, setLocalVesselName] = React.useState(vesselName);
    const [localImo, setLocalImo] = React.useState(imo);

    const handleLocalSearch = () => {
        setVesselName(localVesselName);
        setImo(localImo);
        handleSearch();
    };

    return (
        <div className="mail-table-container">
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
                            placeholder="IMO 编号"
                            className="search-input"
                            value={localImo}
                            onChange={(e) => setLocalImo(e.target.value)}
                            style={{ width: '180px' }}
                        />
                    </div>
                    <button className="btn-primary" onClick={handleLocalSearch}>
                        <Search size={16} style={{ marginRight: '8px' }} />
                        查询
                    </button>
                </div>
            </div>

            <div className="table-wrapper">
                {error ? (
                    <div className="error-state">
                        <div className="error-message">{error}</div>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '200px' }}>船名</th>
                                <th style={{ width: '120px' }}>IMO</th>
                                <th style={{ width: '160px' }}>邮件时间</th>
                                <th style={{ width: '200px' }}>港口</th>
                                <th style={{ width: '400px' }}>Laycan</th>
                                <th style={{ width: '400px' }}>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="5" className="skeleton-cell">
                                            <div className="skeleton-line"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : schedules.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-state">
                                        <div className="empty-content">
                                            <Ship size={48} />
                                            <p>暂无数据</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                schedules.map((item, index) => {
                                    const scheduleList = item.schedule && item.schedule.length > 0 ? item.schedule : [null];
                                    return (
                                        <React.Fragment key={index}>
                                            {scheduleList.map((scheduleItem, sIndex) => (
                                                <tr key={`${index}-${sIndex}`} className={sIndex === 0 ? 'ship-row-start' : ''}>
                                                    {sIndex === 0 && (
                                                        <>
                                                            <td rowSpan={scheduleList.length} className="vessel-cell">
                                                                <div className="subject-text">{item.vessel_name}</div>
                                                            </td>
                                                            <td rowSpan={scheduleList.length} className="imo-cell">
                                                                <div className="sender-text">{item.imo}</div>
                                                            </td>
                                                            <td rowSpan={scheduleList.length} className="date-cell">
                                                                <div className="sender-text">{item.time_date}</div>
                                                            </td>
                                                        </>
                                                    )}
                                                    <td className="schedule-cell-content">
                                                        {scheduleItem ? scheduleItem.port : '-'}
                                                    </td>
                                                    <td className="schedule-cell-content">
                                                        {scheduleItem ? scheduleItem.laycan : '-'}
                                                    </td>
                                                    <td className="schedule-cell-content">
                                                        {scheduleItem ? (scheduleItem.remark || '-') : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })
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
        </div>
    );
};

export default ShipSchedule;
