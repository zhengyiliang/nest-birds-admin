export const DEFAULT_NAME = 'Umi Max';

// 角色类型
export const ROLE_TYPES = {
  32: { text: '超级管理员' },
  16: { text: '管理员' },
  8: { text: '普通用户' },
};

// 账号状态
export const ACCOUNT_STATUS = {
  1: {
    text: '停用',
    status: 'Error',
  },
  0: {
    text: '正常',
    status: 'Success',
  },
};

// 文章状态  发布/草稿
export const ARTICLE_STATUS = {
  0: {
    text: '草稿',
    status: 'warning',
  },
  1: {
    text: '已发布',
    status: 'Success',
  },
};
