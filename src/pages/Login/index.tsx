import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { login } from '@/services/auth';
import { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRequest, useModel, useNavigate } from '@umijs/max';
import { LoginFormPage, ProFormText } from '@ant-design/pro-components';

import './index.less';

const Login = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const navigate = useNavigate();

  const { loading, run } = useRequest(login, {
    manual: true, // 手动调用
    onSuccess({ data, code }) {
      if (code !== 200) return;
      const { accessToken, refreshToken } = data;
      const user = jwt.decode(accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
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
        logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
        title="Github"
        subTitle="全球最大的代码托管平台"
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
          placeholder={'用户名: admin or user'}
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
          placeholder={'密码: ant.design'}
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
