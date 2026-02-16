import React from 'react';
import Modal from '../../common/Modal/Modal';
import { Eye, Anchor, MapPin, ArrowRight, Calendar } from 'lucide-react';
import './ShipInfoModal.css';

/**
 * 船舶信息列表 Modal
 */
const ShipInfoModal = ({ isOpen, onClose, ships, onViewDetails }) => {
    if (!ships || ships.length === 0) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} className="ship-info-modal">
                <div className="mail-detail-container">
                    <h3 className="ship-info-title">提取的信息</h3>
                    <p>暂无船舶信息</p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="ship-info-modal">
            <div className="mail-detail-container">
                <h3 className="ship-info-title">提取的信息</h3>
                <div className="ship-list">
                    {ships.map((ship, index) => (
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
                                                onViewDetails(ship.imo);
                                            }}
                                            style={{
                                                marginLeft: '8px',
                                                padding: '2px 8px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                color: '#1677ff',
                                                border: 'none',
                                                background: 'none'
                                            }}
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
            </div>
        </Modal>
    );
};

/**
 * 船舶详情 Modal
 */
export const ShipDetailModal = ({ isOpen, onClose, shipDetail }) => {
    if (!shipDetail) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="ship-info-modal"
            style={{ maxWidth: '900px' }}
        >
            <div className="mail-detail-container">
                <h3 className="ship-info-title">船舶详情: {shipDetail.vessel_name}</h3>
                <div className="ship-detail-content" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div className="left-column" style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="ship-image">
                            {shipDetail.img_url ? (
                                <img
                                    src={shipDetail.img_url}
                                    alt={shipDetail.vessel_name}
                                    style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '200px',
                                    background: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ color: '#999' }}>暂无图片</span>
                                </div>
                            )}
                        </div>

                        {/* 航次信息区域 - Moved to left column */}
                        {(shipDetail.last_port || shipDetail.destination) && (
                            <div className="voyage-info">
                                <div className="voyage-route">
                                    <div className="port-info from">
                                        <div className="port-icon from-icon">
                                            <Anchor size={20} />
                                        </div>
                                        <div className="port-details">
                                            <span className="port-label">Last Port (ATD)</span>
                                            <span className="port-name" title={shipDetail.last_port || '-'}>{shipDetail.last_port || '-'}</span>
                                            <div className="port-time">
                                                <Calendar size={12} style={{ marginRight: 4 }} />
                                                {shipDetail.atd || '-'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="route-arrow">
                                        <div className="arrow-line"></div>
                                        <ArrowRight size={20} className="arrow-icon" />
                                    </div>

                                    <div className="port-info to">
                                        <div className="port-icon to-icon">
                                            <MapPin size={20} />
                                        </div>
                                        <div className="port-details">
                                            <span className="port-label">Destination (ETA)</span>
                                            <span className="port-name" title={shipDetail.destination || '-'}>{shipDetail.destination || '-'}</span>
                                            <div className="port-time">
                                                <Calendar size={12} style={{ marginRight: 4 }} />
                                                {shipDetail.eta || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="right-column" style={{ flex: '1', minWidth: 0 }}>
                        <div className="ship-info-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '15px'
                        }}>
                            {shipDetail.imo_number && <InfoItem label="IMO Number" value={shipDetail.imo_number} />}
                            {shipDetail.mmsi && <InfoItem label="MMSI" value={shipDetail.mmsi} />}
                            {shipDetail.callsign && <InfoItem label="Call Sign" value={shipDetail.callsign} />}
                            {shipDetail.vessel_type && <InfoItem label="Vessel Type" value={shipDetail.vessel_type} />}
                            {shipDetail.year_of_build && <InfoItem label="Year Built" value={shipDetail.year_of_build} />}
                            {shipDetail.flag && <InfoItem label="Flag" value={shipDetail.flag} />}
                            {shipDetail.length_overall_m && <InfoItem label="Length Overall" value={`${shipDetail.length_overall_m} m`} />}
                            {shipDetail.beam_m && <InfoItem label="Beam" value={`${shipDetail.beam_m} m`} />}
                            {shipDetail.gross_tonnage && <InfoItem label="Gross Tonnage" value={shipDetail.gross_tonnage} />}
                            {shipDetail.deadweight && <InfoItem label="Deadweight" value={`${shipDetail.deadweight} t`} />}
                        </div>
                    </div>
                </div>
                {shipDetail.vessel_url && (
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <a
                            href={`https://www.vesselfinder.com${shipDetail.vessel_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            View on VesselFinder <Eye size={16} />
                        </a>
                    </div>
                )}
            </div>
        </Modal >
    );
};

// 辅助组件
const InfoItem = ({ label, value }) => (
    <div className="info-item">
        <div className="label" style={{ color: '#888', fontSize: '12px' }}>{label}</div>
        <div className="value" style={{ fontWeight: '500' }}>{value}</div>
    </div>
);

export default ShipInfoModal;
