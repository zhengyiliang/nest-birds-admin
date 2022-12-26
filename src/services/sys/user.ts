import { ParamsType } from '@ant-design/pro-components';
import { request } from '@umijs/max';

export async function getUserList(params: API.UserList | ParamsType) {
  return request('/sys/user/list', {
    method: 'get',
    params: params,
  });
}
