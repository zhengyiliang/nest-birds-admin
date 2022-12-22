import { request } from '@umijs/max';

export async function getUserList(params: API.UserList) {
  return request('/sys/user/list', {
    method: 'get',
    params: params,
  });
}
