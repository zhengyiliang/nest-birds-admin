import { ParamsType } from '@ant-design/pro-components';
import { request } from '@umijs/max';

export async function getTagList(params: API.Tag | ParamsType) {
  return request('/blog/tag/list', {
    method: 'get',
    params,
  });
}

export async function getAllTag() {
  return request('/blog/tag/all/get', {
    method: 'get',
  });
}

export async function createTag(data: API.Tag | ParamsType) {
  return request('/blog/tag/create', {
    method: 'post',
    data,
  });
}

export async function updateTag(data: API.Tag | ParamsType, id: number) {
  return request('/blog/tag/update', {
    method: 'put',
    data,
    params: { id },
  });
}

export async function deleteTag(params: { id: number }) {
  return request('/blog/tag/delete', {
    method: 'delete',
    params,
  });
}
