// 邮件状态常量
export const MAIL_STATUS = {
    UNPROCESSED: 0,
    PENDING: 1,
    PROCESSED: 2
};

// 邮件状态配置
export const MAIL_STATUS_CONFIG = {
    [MAIL_STATUS.UNPROCESSED]: {
        label: '未处理',
        className: 'badge-red'
    },
    [MAIL_STATUS.PENDING]: {
        label: '待处理',
        className: 'badge-yellow'
    },
    [MAIL_STATUS.PROCESSED]: {
        label: '已处理',
        className: 'badge-green'
    }
};

// 判断邮件是否可选择
export const isMailSelectable = (status) => true;
