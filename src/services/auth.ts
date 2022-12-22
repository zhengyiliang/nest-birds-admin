import { request } from '@umijs/max';

export async function login(params: API.User) {
  return request('/login', {
    method: 'post',
    data: params,
  });
}
