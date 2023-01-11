declare namespace API {
  export interface User {
    id?: number | string;
    name?: string;
    email?: string;
    avatar?: string;
    description?: string;
    auth?: number | string;
    status?: number | string;
    password?: string;
  }
  export interface UserList {
    current: number;
    pageSize: number;
    keyword?: string;
    status?: number;
    time?: string[];
  }

  export interface Tag {
    id: number;
    name: string;
    desc: string;
  }

  export interface Category {
    id: number;
    name: string;
    description: string;
  }

  export interface Article {
    id: number;
    title: string;
    content: string;
    description: string;
    cover: string;
    category_id: number;
    isPublic: number;
    status: number;
    isTop: number;
    isHot: number;
    current: number;
    pageSize: number;
    keyword: number;
  }
}
