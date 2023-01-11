import { initialStateProps } from '@/app';
export default (initialState: initialStateProps) => {
  const { user } = initialState;
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://next.umijs.org/docs/max/access
  // const canSeeAdmin = !!(
  //   initialState && initialState.name !== 'dontHaveAccess'
  // );
  return {
    // canSeeAdmin,
    self: user?.scope === 16,
  };
};
