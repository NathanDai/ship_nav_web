import { post } from './request';

/**
 * 获取船舶详情
 * @param {string} imo - IMO编号
 * @returns {Promise}
 */
export const getShipDetails = async (imo) => {
    return post('/rest/vessel/get_ship_details', { imo });
};
