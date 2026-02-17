import { useState, useEffect, useCallback } from 'react';
import { fetchMailList, updateMail163, getMailSchedule, getMailContact } from '../api/index.js';
import { PAGINATION } from '../constants/config';

/**
 * 邮件数据管理 Hook
 * @param {number} initialPage - 初始页码
 * @param {number} initialPageSize - 初始每页数量
 * @returns {object} 邮件数据和操作方法
 */
export const useMails = (
    initialPage = PAGINATION.DEFAULT_PAGE,
    initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE
) => {
    const [mails, setMails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(initialPage);
    const [pageSize] = useState(initialPageSize);
    const [total, setTotal] = useState(0);
    const [subject, setSubject] = useState('');
    const [querySubject, setQuerySubject] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const [searchTrigger, setSearchTrigger] = useState(0);

    // 获取邮件列表
    const fetchMails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchMailList(page, pageSize, querySubject);
            setMails(response.items);
            setTotal(response.total);
        } catch (err) {
            console.error('Failed to load mails', err);
            setError('Failed to load emails. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, querySubject, searchTrigger]);

    // 刷新邮件
    const refreshMails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await updateMail163();
            setRefreshKey(prev => prev + 1);
            return { success: true };
        } catch (err) {
            console.error('Failed to update mails', err);
            setError('Failed to update emails. Please try again.');
            setLoading(false);
            return { success: false, error: err };
        }
    }, []);

    // 搜索邮件
    const searchMails = useCallback(() => {
        setPage(PAGINATION.DEFAULT_PAGE);
        setQuerySubject(subject);
        setSearchTrigger(prev => prev + 1);
    }, [subject]);

    // 获取船期
    const fetchSchedule = useCallback(async (ids) => {
        try {
            const result = await getMailSchedule(ids);
            return { success: true, data: result };
        } catch (err) {
            console.error('Failed to get schedule', err);
            return { success: false, error: err };
        }
    }, []);

    // 获取联系人
    const fetchContact = useCallback(async (ids) => {
        try {
            const result = await getMailContact(ids);
            return { success: true, data: result };
        } catch (err) {
            console.error('Failed to get contact', err);
            return { success: false, error: err };
        }
    }, []);

    // 自动获取数据
    useEffect(() => {
        let ignore = false;

        const loadData = async () => {
            await fetchMails();
        };

        if (!ignore) {
            loadData();
        }

        return () => {
            ignore = true;
        };
    }, [fetchMails, refreshKey]);

    return {
        // 数据
        mails,
        loading,
        error,
        page,
        pageSize,
        total,
        subject,
        querySubject,

        // 操作方法
        setPage,
        setSubject,
        refreshMails,
        searchMails,
        fetchSchedule,
        fetchContact,
    };
};
