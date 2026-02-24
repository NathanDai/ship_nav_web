import React from 'react';
import Modal from '../../common/Modal/Modal';
import { Eye, Anchor, MapPin, ArrowRight, Calendar, Info, Share2, Printer, X, Ship, Compass, Settings, ShieldAlert, Plane } from 'lucide-react';
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
                        提取的船舶
                    </h3>
                    <div className="empty-state">
                        <p>未提取到船舶信息。</p>
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
                    提取的船舶
                </h3>
                <div className="ship-list">
                    {ships.map((ship, index) => (
                        <div key={index} className="ship-item">
                            <div className="ship-header">
                                <div className="ship-header-info">
                                    <div>
                                        <span className="ship-info-label">船名：</span>
                                        <strong>{ship.vessel_name}</strong>
                                    </div>
                                    <div>
                                        <span className="ship-info-label">IMO：</span>
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
                                        title="查看详细船舶信息"
                                    >
                                        查看详情
                                    </button>
                                )}
                            </div>
                            <div className="ship-schedule">
                                <h4 className="ship-schedule-title">船期</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Open位置</th>
                                            <th>ETA位置</th>
                                            <th>Open日期</th>
                                            <th>ETA日期</th>
                                            <th>航线意向</th>
                                            <th>备注</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ship.schedule && ship.schedule.map((sch, idx) => (
                                            <tr key={idx}>
                                                <td>{sch.open_port || sch.open_region || '-'}</td>
                                                <td>{sch.eta_port || sch.eta_region || '-'}</td>
                                                <td>{sch.open_laycan || '-'}</td>
                                                <td>{sch.eta_laycan || '-'}</td>
                                                <td>{sch.trade_intent || '-'}</td>
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
            className="ship-detail-modal-wrapper"
        >
            <div className="sd-container">
                {/* Header */}
                <div className="sd-header">
                    <div className="sd-header-left">
                        <Anchor size={24} className="sd-header-icon" />
                        <h2 className="sd-vessel-name">{shipDetail.vessel_name || 'UNKNOWN'}</h2>
                        {shipDetail.imo_number && (
                            <span className="sd-imo-badge">IMO: {shipDetail.imo_number}</span>
                        )}
                    </div>
                    <div className="sd-header-right">
                        <button className="sd-icon-btn" title="分享"><Share2 size={20} /></button>
                        <button className="sd-icon-btn" title="打印"><Printer size={20} /></button>
                        <button className="sd-icon-btn" onClick={onClose} title="关闭"><X size={20} /></button>
                    </div>
                </div>

                <div className="sd-content">
                    {/* Left Column */}
                    <div className="sd-left-col">
                        <div className="sd-image-card">
                            {shipDetail.img_url ? (
                                <img
                                    src={shipDetail.img_url}
                                    alt={shipDetail.vessel_name}
                                    className="sd-main-img"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="sd-no-img">暂无图片</div>
                            )}
                        </div>

                        {/* Real-time Location - Hidden as requested */}
                        {/*
                        <div className="sd-card">
                            <div className="sd-card-header-flex">
                                <div className="sd-card-title">
                                    <Compass size={16} color="#3b82f6" /> 实时位置
                                </div>
                                <span className="sd-status-badge">Underway</span>
                            </div>

                            <div className="sd-voyage">
                                <div className="sd-port-box">
                                    <div className="sd-port-label">上一港 (ATD)</div>
                                    <div className="sd-port-name" title={shipDetail.last_port}>{shipDetail.last_port || '-'}</div>
                                    <div className="sd-port-time">{shipDetail.atd ? shipDetail.atd.replace(' UTC', '\nUTC') : '-'}</div>
                                </div>

                                <div className="sd-voyage-divider">
                                    <Plane size={24} className="sd-plane-icon" />
                                    <div className="sd-speed">{shipDetail.speed ? `${shipDetail.speed} kts` : '12.5 kts'}</div>
                                </div>

                                <div className="sd-port-box right-align">
                                    <div className="sd-port-label">目的地 (ETA)</div>
                                    <div className="sd-port-name" title={shipDetail.destination}>{shipDetail.destination || '-'}</div>
                                    <div className="sd-port-time">{shipDetail.eta ? shipDetail.eta.replace(' UTC', '\nUTC') : '-'}</div>
                                </div>
                            </div>

                            <button className="sd-track-btn">
                                <MapPin size={16} /> 查看历史轨迹
                            </button>
                        </div>
                        */}
                    </div>

                    {/* Right Column */}
                    <div className="sd-right-col">
                        {/* Basic Specs */}
                        <div className="sd-section">
                            <h3 className="sd-section-title blue-border">基础信息</h3>
                            <div className="sd-grid-4">
                                <InfoCard label="IMO Number" value={shipDetail.imo_number} />
                                <InfoCard label="MMSI" value={shipDetail.mmsi} />
                                <InfoCard label="呼号 (Call Sign)" value={shipDetail.callsign} />
                                <InfoCard label="船舶类型" value={shipDetail.vessel_type} />
                                <InfoCard label="建造年份" value={shipDetail.year_of_build} />
                                <InfoCard label="船旗 (Flag)" value={shipDetail.flag} />
                            </div>
                        </div>

                        {/* Dimensions & Capacity */}
                        <div className="sd-section">
                            <h3 className="sd-section-title green-border">尺寸与载重</h3>
                            <div className="sd-grid-4">
                                <InfoCard label="全长 (LOA)" value={shipDetail.length_overall_m ? `${shipDetail.length_overall_m} m` : '-'} />
                                <InfoCard label="型宽 (Beam)" value={shipDetail.beam_m ? `${shipDetail.beam_m} m` : '-'} />
                                <InfoCard label="总吨位 (GT)" value={shipDetail.gross_tonnage} />
                                <InfoCard label="载重吨 (DWT)" value={shipDetail.deadweight ? `${shipDetail.deadweight} t` : '-'} />
                            </div>
                        </div>

                        {/* Technical Capabilities - Hidden as requested */}
                        {/*
                        <div className="sd-section">
                            <h3 className="sd-section-title yellow-border">技术参数 (TECHNICAL CAPABILITIES)</h3>
                            <div className="sd-grid-2">
                                <div className="sd-tech-card">
                                    <div className="sd-tech-item">
                                        <Settings size={18} className="sd-tech-icon" />
                                        <div>
                                            <div className="sd-tech-label">起重设备 (Cranes)</div>
                                            <div className="sd-tech-val">{shipDetail.cranes || '4 × 30t SWL (Grab fitted)'}</div>
                                        </div>
                                    </div>
                                    <div className="sd-tech-item">
                                        <Ship size={18} className="sd-tech-icon" />
                                        <div>
                                            <div className="sd-tech-label">货舱/舱盖 (Holds/Hatches)</div>
                                            <div className="sd-tech-val">{shipDetail.holds_hatches || '5 Holds / 5 Hatches'}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="sd-tech-card">
                                    <div className="sd-tech-item">
                                        <Settings size={18} className="sd-tech-icon" />
                                        <div>
                                            <div className="sd-tech-label">主机 (Main Engine)</div>
                                            <div className="sd-tech-val">{shipDetail.main_engine || 'MAN-B&W 6S50MC-C'}</div>
                                        </div>
                                    </div>
                                    <div className="sd-tech-item">
                                        <Anchor size={18} className="sd-tech-icon" />
                                        <div>
                                            <div className="sd-tech-label">吃水 (Draft)</div>
                                            <div className="sd-tech-val">{shipDetail.draft || '12.8m (Summer)'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        */}

                        {/* AI Risk Assessment - Hidden as requested */}
                        {/*
                        <div className="sd-section sd-risk-section">
                            <h3 className="sd-section-title purple-title">
                                <ShieldAlert size={18} /> AI 风险评估 (Risk Assessment)
                            </h3>
                            <div className="sd-risk-grid">
                                <div>
                                    <div className="sd-risk-label">PSC 检查记录</div>
                                    <div className="sd-risk-val success">良好 (Low Risk)</div>
                                </div>
                                <div>
                                    <div className="sd-risk-label">制裁状态</div>
                                    <div className="sd-risk-val success">CLEAN</div>
                                </div>
                                <div>
                                    <div className="sd-risk-label">CII Rating</div>
                                    <div className="sd-risk-val warning">C (Moderate)</div>
                                </div>
                            </div>
                            <div className="sd-risk-desc">
                                "Recent trading pattern shows frequent calls in SE Asia. No adverse reports found in last 12 months."
                            </div>
                        </div>
                        */}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

// Helper Component
const InfoCard = ({ label, value }) => (
    <div className="sd-info-card">
        <div className="sd-info-label">{label}</div>
        <div className="sd-info-val">{value || '-'}</div>
    </div>
);

export default ShipInfoModal;
