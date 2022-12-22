declare namespace API {
  export interface User {
    id?: number;
    name?: string;
    email?: string;
    avatar?: string;
    description?: string;
    auth?: number;
    status?: number;
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
