import { API_CODE } from '../constants/config';

/**
 * 统一的请求封装
 * @param {string} url - 请求URL
 * @param {object} options - fetch options
 * @returns {Promise} 返回响应数据
 */
export const request = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.code !== API_CODE.SUCCESS) {
            throw new Error(result.message || 'API returned error code');
        }

        return result.data;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
};

/**
 * GET 请求
 */
export const get = (url, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return request(fullUrl, { method: 'GET' });
};

/**
 * POST 请求
 */
export const post = (url, data = {}) => {
    return request(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};
