export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    component: './Home',
  },
  // {
  //   name: '权限演示',
  //   path: '/access',
  //   component: './Access',
  // },
  // {
  //   name: ' CRUD 示例',
  //   path: '/table',
  //   component: './Table',
  // },
  {
    name: '系统管理',
    path: '/sys',
    // redirect: '/sys/user',
    routes: [
      {
        name: '用户管理',
        path: '/sys/user',
        component: './System/User',
      },
      // {
      //   name: '角色管理',
      //   path: '/sys/role',
      //   component: './System/Role',
      // },
    ],
  },
  {
    name: '博客管理',
    path: '/blog',
    routes: [
      {
        name: '文章管理',
        path: '/blog/article',
        component: './Blog/Article',
      },
      {
        name: '创建文章',
        path: '/blog/article/create',
        hideInMenu: true,
        component: './Blog/Article/Create',
      },
      {
        name: '修改文章',
        path: '/blog/article/update/:id',
        hideInMenu: true,
        component: './Blog/Article/Update',
      },
      {
        name: '分类管理',
        path: '/blog/category',
        component: './Blog/Category',
      },
      {
        name: '标签管理',
        path: '/blog/tag',
        component: './Blog/Tag',
      },
      {
        name: '留言管理',
        path: '/blog/message',
        component: './Blog/Message',
      },
    ],
  },
  {
    path: '/login',
    name: '登录',
    component: './Login',
    hideInMenu: true,
    layout: false,
  },
];
