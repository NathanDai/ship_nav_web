import { useState, useCallback, useEffect } from 'react';
import { fetchShipScheduleList } from '../api';
import { PAGINATION } from '../constants/config';

/**
 * 船舶排期数据管理 Hook
 * @param {number} initialPage - 初始页码
 * @param {number} initialPageSize - 初始每页数量
 * @returns {object} 排期数据和操作方法
 */
export const useShipSchedule = (
    initialPage = PAGINATION.DEFAULT_PAGE,
    initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE
) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(initialPage);
    const [pageSize] = useState(initialPageSize);
    const [total, setTotal] = useState(0);
    const [vesselName, setVesselName] = useState('');
    const [imo, setImo] = useState('');

    // 用于触发重新从第一页开始查询的 key
    const [queryKey, setQueryKey] = useState(0);

    // 获取排期列表
    const fetchSchedules = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchShipScheduleList(page, pageSize, vesselName, imo);
            setSchedules(response.items || []);
            setTotal(response.total || 0);
        } catch (err) {
            console.error('Failed to load schedules', err);
            setError('Failed to load schedules. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, vesselName, imo]); // 依赖项包括查询条件

    // 执行查询 - 重置到第一页
    const handleSearch = useCallback(() => {
        setPage(1);
        // 如果当前已经在第一页，需要强制触发更新
        if (page === 1) {
            fetchSchedules();
        }
    }, [page, fetchSchedules]);

    // 自动获取数据
    useEffect(() => {
        let ignore = false;

        const loadData = async () => {
            // 只有当不是因为点击查询按钮导致的页码重置时才自动获取（防止重复）
            // 其实 create-react-app dev 模式下 useEffect 会执行两次
            await fetchSchedules();
        };

        if (!ignore) {
            loadData();
        }

        return () => {
            ignore = true;
        };
    }, [fetchSchedules]);

    return {
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
    };
};
