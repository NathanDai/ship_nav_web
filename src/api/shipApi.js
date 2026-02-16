import { post } from './request';

/**
 * 获取船舶详情
 * @param {string} imo - IMO编号
 * @param {boolean} isEta - 是否获取ETA
 * @returns {Promise}
 */
export const getShipDetails = async (imo, isEta = false) => {
    return post('/rest/vessel/get_ship_details', { imo, is_eta: isEta });
};
