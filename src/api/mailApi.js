import { post, get } from './request';

/**
 * 获取邮件列表
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @param {string} subject - 主题搜索关键词
 * @returns {Promise<{items: Array, total: number}>}
 */
export const fetchMailList = async (page, pageSize, subject = '') => {
    const data = await post('/rest/mail/get_mail_page', {
        page,
        page_size: pageSize,
        subject
    });

    // 映射数据格式
    const items = data.items.map((item) => ({
        id: item.id,
        uid: item.uid,
        subject: item.subject || 'No Subject',
        sender: item.from_email || 'Unknown Sender',
        toEmail: item.to_email || '',
        date: item.time_date,
        status: item.email_status,
        content: item.content || '',
        extractedShipsInfo: item.extracted_ships_info || [],
    }));

    return {
        items,
        total: data.total,
    };
};

/**
 * 更新163邮件
 * @returns {Promise}
 */
export const updateMail163 = async () => {
    return get('/rest/mail/update_mail_163');
};

/**
 * 获取邮件船期
 * @param {Array<number>} ids - 邮件ID列表
 * @returns {Promise}
 */
export const getMailSchedule = async (ids) => {
    return post('/rest/mail/get_mail_schedule', { ids });
};
