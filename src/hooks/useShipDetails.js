import { useState, useCallback } from 'react';
import { getShipDetails } from '../api/index.js';

/**
 * 船舶详情管理 Hook
 * @returns {object} 船舶详情数据和操作方法
 */
export const useShipDetails = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchShipDetails = useCallback(async (imo) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getShipDetails(imo);
            setLoading(false);
            return { success: true, data };
        } catch (err) {
            console.error('Failed to get ship details', err);
            setError('Failed to get ship details');
            setLoading(false);
            return { success: false, error: err };
        }
    }, []);

    return {
        loading,
        error,
        fetchShipDetails
    };
};
