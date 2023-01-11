import { ParamsType } from '@ant-design/pro-components';
import { request } from '@umijs/max';

export async function getCategoryList(params: API.Category | ParamsType) {
  return request('/blog/category/list', {
    method: 'get',
    params,
  });
}

export async function getAllCategory() {
  return request('/blog/category/all/get', {
    method: 'get',
  });
}

export async function createCategory(data: API.Category | ParamsType) {
  return request('/blog/category/create', {
    method: 'post',
    data,
  });
}

export async function updateCategory(
  data: API.Category | ParamsType,
  id: number,
) {
  return request('/blog/category/update', {
    method: 'put',
    data,
    params: { id },
  });
}

export async function deleteCategory(params: { id: number }) {
  return request('/blog/category/delete', {
    method: 'delete',
    params,
  });
}
