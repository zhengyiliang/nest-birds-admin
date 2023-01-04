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
}
