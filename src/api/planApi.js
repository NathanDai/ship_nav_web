import { post } from './request';

/**
 * 获取船舶计划列表
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @param {string} vesselName - 船名
 * @param {string} imo - IMO编号
 * @param {string} openLaycan - Open日期 (YYYY-MM-DD格式)
 * @param {string} openPort - Open位置/港口
 * @returns {Promise<{items: Array, total: number}>}
 */
export const fetchShipPlanList = async (page, pageSize, vesselName = '', imo = '', openLaycan = '', openPort = '') => {
    const data = await post('/rest/plan/get_ship_plan_page', {
        page,
        page_size: pageSize,
        vessel_name: vesselName,
        imo,
        open_laycan: openLaycan,
        open_port: openPort
    });

    return {
        items: data.items || [],
        total: data.total || 0,
    };
};
