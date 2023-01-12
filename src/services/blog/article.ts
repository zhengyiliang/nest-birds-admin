import { request } from '@umijs/max';

export async function getArticleList(data: Partial<API.Article>) {
  return request('/blog/article/list', {
    method: 'post',
    data,
  });
}

export async function createArticle(data: API.Article) {
  return request('/blog/article/create', {
    method: 'post',
    data,
  });
}

export async function getDetail(params: { id?: string }) {
  return request('/blog/article/detail', {
    method: 'get',
    params,
  });
}

export async function updateArticle(data: API.Article) {
  return request('/blog/article/update', {
    method: 'put',
    data,
  });
}

export async function uploadCover(data: FormData) {
  return request('/blog/article/cover/upload', {
    method: 'post',
    data,
  });
}

export async function deleteCover(params: { filename?: string }) {
  return request('/blog/article/cover/delete', {
    method: 'delete',
    params,
  });
}

export async function uploadImg(data: FormData) {
  return request('/blog/article/image/upload', {
    method: 'post',
    data,
  });
}
