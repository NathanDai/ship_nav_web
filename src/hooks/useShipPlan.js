import { useState, useCallback, useEffect } from 'react';
import { fetchShipPlanList } from '../api';
import { PAGINATION } from '../constants/config';

/**
 * 船舶计划数据管理 Hook
 * @param {number} initialPage - 初始页码
 * @param {number} initialPageSize - 初始每页数量
 * @returns {object} 计划数据和操作方法
 */
export const useShipPlan = (
    initialPage = PAGINATION.DEFAULT_PAGE,
    initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE
) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(initialPage);
    const [pageSize] = useState(initialPageSize);
    const [total, setTotal] = useState(0);
    const [vesselName, setVesselName] = useState('');
    const [imo, setImo] = useState('');
    const [openLaycan, setOpenLaycan] = useState('');
    const [openPort, setOpenPort] = useState('');

    // 用于触发重新从第一页开始查询的 key
    const [queryKey, setQueryKey] = useState(0);

    // 获取计划列表
    const fetchPlans = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchShipPlanList(page, pageSize, vesselName, imo, openLaycan, openPort);
            setPlans(response.items || []);
            setTotal(response.total || 0);
        } catch (err) {
            console.error('Failed to load ship plans', err);
            setError('Failed to load ship plans. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, vesselName, imo, openLaycan, openPort]); // 依赖项包括查询条件

    // 执行查询
    const searchPlans = useCallback((newVesselName, newImo, newOpenLaycan, newOpenPort) => {
        if (newVesselName !== vesselName || newImo !== imo || newOpenLaycan !== openLaycan || newOpenPort !== openPort) {
            setPage(PAGINATION.DEFAULT_PAGE);
            setVesselName(newVesselName);
            setImo(newImo);
            setOpenLaycan(newOpenLaycan);
            setOpenPort(newOpenPort);
        } else {
            // 如果查询条件没变，手动触发刷新
            setQueryKey(prev => prev + 1);
        }
    }, [vesselName, imo, openLaycan, openPort]);

    // 自动获取数据
    useEffect(() => {
        let ignore = false;

        const loadData = async () => {
            await fetchPlans();
        };

        if (!ignore) {
            loadData();
        }

        return () => {
            ignore = true;
        };
    }, [fetchPlans, queryKey]);

    return {
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
    };
};
