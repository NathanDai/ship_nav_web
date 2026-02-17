import { get } from './request';

/**
 * 获取队列状态
 * @returns {Promise<{pending: number, running: number, workers: number}>}
 */
export const getQueueStatus = async () => {
    return get('/rest/general/queue_status');
};
