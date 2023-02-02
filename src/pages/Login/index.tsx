import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { login } from '@/services/auth';
import { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRequest, useModel, useNavigate } from '@umijs/max';
import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import logo from '@/favicon.ico';

import './index.less';

const Login = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const navigate = useNavigate();

  const { loading, run } = useRequest(login, {
    manual: true, // 手动调用
    onSuccess({ data, code }) {
      if (code !== 200) return;
      const { accessToken, refreshToken } = data;
      const user: any = jwt.decode(accessToken);
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      setInitialState({ user });
    },
  });

  useEffect(() => {
    if (initialState?.user) {
      navigate('/home');
    }
  }, [initialState]);

  return (
    <div
      style={{
        backgroundColor: '#fff',
        height: '100vh',
        margin: -8,
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
        logo={logo}
        title="正好有时间"
        subTitle="博客后台管理系统"
        onFinish={async (values: API.User) => {
          // 表单项校验成功后执行
          run(values);
        }}
        submitter={{
          submitButtonProps: {
            loading,
          },
        }}
      >
        <ProFormText
          name="name"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder={'请输入用户名'}
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'请输入密码'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
      </LoginFormPage>
    </div>
  );
};

export default Login;
