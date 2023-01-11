import { ParamsType } from '@ant-design/pro-components';
import { request } from '@umijs/max';

export async function getUserList(params: API.UserList | ParamsType) {
  return request('/sys/user/list', {
    method: 'get',
    params: params,
  });
}

export async function getUserByAuth() {
  return request('/sys/user/get', {
    method: 'get',
  });
}

export async function deleteUser(params: { id: number }) {
  return request('/sys/user/delete', {
    method: 'delete',
    params,
  });
}

export async function createUser(data: API.User) {
  return request('/sys/user/create', {
    method: 'post',
    data,
  });
}

export async function updateUser(data: API.User, id: string | number) {
  return request('/sys/user/update', {
    method: 'put',
    data,
    params: { id },
  });
}

export async function resetPassword(id: string | number) {
  return request('/sys/user/password/reset', {
    method: 'put',
    params: { id },
  });
}

export async function updateStatus(data: {
  id: string | number;
  status: string | number;
}) {
  return request('/sys/user/status/update', {
    method: 'put',
    data: data,
  });
}
