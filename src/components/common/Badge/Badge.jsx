import React from 'react';
import { MAIL_STATUS_CONFIG } from '../../../constants/mailStatus';
import './Badge.css';

/**
 * Badge 徽章组件
 * @param {number} status - 状态值
 */
const Badge = ({ status }) => {
    const config = MAIL_STATUS_CONFIG[status] || {
        label: '未知',
        className: 'badge-gray'
    };

    return (
        <span className={`badge ${config.className}`}>
            <span className="badge-dot"></span>
            {config.label}
        </span>
    );
};

export default Badge;
