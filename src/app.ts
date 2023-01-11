import logo from './favicon.ico';
import { message } from 'antd';
import {
  RequestConfig,
  history,
  RunTimeLayoutConfig,
  request as $request,
} from '@umijs/max';
import jwt from 'jsonwebtoken';
import { getRefreshToken } from '@/services/auth';
// import { LayoutContextProps } from 'antd/es/layout/layout';
// import { useRequest, useModel, useNavigate } from '@umijs/max';

// 退出登录
const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  history.push('/login');
};

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
      // step2: auth 处理
      if (url === '/refresh') {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          options.headers.authorization = 'Bearer ' + refreshToken;
        }
      } else {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          options.headers.authorization = 'Bearer ' + accessToken;
        }
      }
      // const token = localStorage.getItem('accessToken');
      // if (token) {
      //   options.headers.authorization = 'Bearer ' + token;
      // }
      return { url, options };
    },
  ],
  //响应拦截器
  responseInterceptors: [
    (response: any) => {
      const { data, config } = response;
      const { code, errorCode, message: msg } = data;
      const { url, params, method, data: configData } = config;
      // 如果是令牌无效或者是 refreshToken 相关异常
      if (errorCode === 10010 || errorCode === 10100) {
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          const { origin } = window.location;
          window.location.href = origin;
        }, 1500);
      }

      // 令牌失效 或 令牌过期 需要重新刷新令牌
      if (errorCode === 10020 || errorCode === 10030) {
        const fn = async () => {
          const { data } = await getRefreshToken();
          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
          // 重新发起请求
          const result = await $request(url, {
            method,
            params,
            data: configData,
          });
          return result;
        };

        return { ...response, data: fn() };
      }

      if (code !== 200 || errorCode !== 0) {
        message.error(msg);
      }
      // 10010认证失败  10020令牌失效 10030令牌过期
      // if ([10010, 10020, 10030]?.includes(data?.errorCode)) {
      //   logout()
      // }
      //在就行拦截器里可以直接返回响应体里的data字段
      return response; // success
    },
  ],
};

export interface userProps {
  uid: number;
  scope: number;
  name: string;
  avatar: string;
  type: string;
  iat: number;
  exp: number;
}

export interface initialStateProps {
  user?: userProps | null;
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<initialStateProps> {
  let initialState: initialStateProps = {
    user: null,
  };
  const token = localStorage.getItem('access_token');
  if (token) {
    initialState.user = jwt.decode(token) as userProps;
  }
  return initialState;
}

export const layout: RunTimeLayoutConfig = (props) => {
  const { initialState, setInitialState } = props;
  return {
    logo,
    waterMarkProps: {
      content: '正好有时间',
    },
    menu: {
      locale: false,
    },
    // rightRender: () => 11, // 展示用户名、头像、退出登录相关组件
    logout: async () => {
      await setInitialState({ user: null });
      logout();
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
