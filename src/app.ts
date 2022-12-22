import logo from './favicon.ico';
import { message } from 'antd';
import { RequestConfig, history, RunTimeLayoutConfig } from '@umijs/max';
import jwt, { JwtPayload } from 'jsonwebtoken';
// import { LayoutContextProps } from 'antd/es/layout/layout';
// import { useRequest, useModel, useNavigate } from '@umijs/max';

// 运行时配置
export const request: RequestConfig = {
  timeout: 3000,
  headers: {
    ['Content-Type']: 'application/json',
    Accept: 'application/json',
    credential: 'include',
  },
  baseURL: '/api',
  //请求拦截器
  requestInterceptors: [
    (url: string, options: any) => {
      options.headers = options.headers || {};
      //每次请求接口的时候，都需要把本地存的token发回服务器
      const token = localStorage.getItem('token');
      if (token) {
        options.headers.authorization = 'Bears' + token;
      }
      return { url, options };
    },
  ],
  //响应拦截器
  responseInterceptors: [
    (response: any) => {
      const { data } = response;
      if (data?.code !== 201 || data?.errorCode !== 0) {
        message.error(data.message);
      }
      //在就行拦截器里可以直接返回响应体里的data字段
      return response; // success
    },
  ],
};

interface userProps {
  uid: number;
  scope: number;
  name: string;
  avatar: string;
  type: string;
  iat: number;
  exp: number;
}

interface initialStateProps {
  user?: userProps | string | JwtPayload | null;
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<initialStateProps> {
  let initialState: initialStateProps = {
    user: null,
  };
  const token = localStorage.getItem('accessToken');
  if (token) {
    initialState.user = jwt.decode(token);
  }
  return initialState;
}

export const layout: RunTimeLayoutConfig = (props) => {
  const { initialState, setInitialState } = props;
  return {
    logo,
    menu: {
      locale: false,
    },
    // rightRender: () => 11, // 展示用户名、头像、退出登录相关组件
    logout: () => {
      localStorage.clear();
      sessionStorage.clear();
      setInitialState({ user: null });
      history.push('/login');
    },
    onPageChange() {
      const { user } = initialState ?? {};
      if (!user) {
        history.push('/login');
      }
    },
    // avatarProps: {
    //   src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    //   title: '七妮妮',
    // },
    // actionsRender: (props: any) => {
    //   if (props.isMobile) return [];
    //   return [
    //     <InfoCircleFilled key="InfoCircleFilled" />,
    //     <QuestionCircleFilled key="QuestionCircleFilled" />,
    //     <GithubFilled key="GithubFilled" />,
    //   ];
    // },
  };
};
