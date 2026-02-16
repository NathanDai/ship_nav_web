import { post } from './request';

/**
 * 获取船舶排期列表
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @param {string} vesselName - 船名
 * @param {string} imo - IMO编号
 * @returns {Promise<{items: Array, total: number}>}
 */
export const fetchShipScheduleList = async (page, pageSize, vesselName = '', imo = '') => {
    const data = await post('/rest/schedule/get_ship_schedule_page', {
        page,
        page_size: pageSize,
        vessel_name: vesselName,
        imo
    });

    return {
        items: data.items || [],
        total: data.total || 0,
    };
};
