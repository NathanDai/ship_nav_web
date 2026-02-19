import React from 'react';
import Modal from '../../common/Modal/Modal';
import { Eye, Anchor, MapPin, ArrowRight, Calendar, Info } from 'lucide-react';
import './ShipInfoModal.css';

/**
 * Ship Info List Modal (Extracted Ships from Mail)
 */
const ShipInfoModal = ({ isOpen, onClose, ships, onViewDetails }) => {
    if (!ships || ships.length === 0) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} className="ship-info-modal">
                <div className="mail-detail-container">
                    <h3 className="ship-info-title">
                        <Info size={20} />
                        Extracted Ships
                    </h3>
                    <div className="empty-state">
                        <p>No ship information extracted.</p>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="ship-info-modal">
            <div className="mail-detail-container">
                <h3 className="ship-info-title">
                    <Info size={20} />
                    Extracted Ships
                </h3>
                <div className="ship-list">
                    {ships.map((ship, index) => (
                        <div key={index} className="ship-item">
                            <div className="ship-header">
                                <div className="ship-header-info">
                                    <div>
                                        <span className="ship-info-label">Vessel:</span>
                                        <strong>{ship.vessel_name}</strong>
                                    </div>
                                    <div>
                                        <span className="ship-info-label">IMO:</span>
                                        {ship.imo}
                                    </div>
                                </div>
                                {ship.imo && (
                                    <button
                                        className="btn-link"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewDetails(ship.imo);
                                        }}
                                        title="View detailed ship info"
                                    >
                                        View Details
                                    </button>
                                )}
                            </div>
                            <div className="ship-schedule">
                                <h4 className="ship-schedule-title">Schedule</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Port</th>
                                            <th>Laycan</th>
                                            <th>Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ship.schedule && ship.schedule.map((sch, idx) => (
                                            <tr key={idx}>
                                                <td>{sch.port}</td>
                                                <td>{sch.laycan}</td>
                                                <td>{sch.remark || '-'}</td>
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
 * Ship Detail Modal (Detailed view from API)
 */
export const ShipDetailModal = ({ isOpen, onClose, shipDetail }) => {
    if (!shipDetail) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="ship-info-modal"
        >
            <div className="mail-detail-container">
                <h3 className="ship-info-title">
                    <Anchor size={20} />
                    {shipDetail.vessel_name}
                </h3>
                <div className="ship-detail-content">
                    {/* Left Column: Image & Voyage */}
                    <div className="left-column">
                        <div className="ship-image">
                            {shipDetail.img_url ? (
                                <img
                                    src={shipDetail.img_url}
                                    alt={shipDetail.vessel_name}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="no-image-placeholder">
                                    <span>No Image Available</span>
                                </div>
                            )}
                        </div>

                        {/* Voyage Info */}
                        {(shipDetail.last_port || shipDetail.destination) && (
                            <div className="voyage-info">
                                <div className="voyage-route">
                                    <div className="port-info from">
                                        <div className="port-icon from-icon">
                                            <Anchor size={18} />
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
                                        <ArrowRight size={20} />
                                    </div>

                                    <div className="port-info to">
                                        <div className="port-icon to-icon">
                                            <MapPin size={18} />
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

                    {/* Right Column: Key Details */}
                    <div className="right-column">
                        <div className="ship-info-grid">
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

                {/* Externals Link */}
                <div className="modal-actions">
                    {shipDetail.vessel_url && (
                        <a
                            href={`https://www.vesselfinder.com${shipDetail.vessel_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                            View on VesselFinder <Eye size={16} />
                        </a>
                    )}
                </div>
            </div>
        </Modal >
    );
};

// Helper Component
const InfoItem = ({ label, value }) => (
    <div className="info-item">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
    </div>
);

export default ShipInfoModal;
