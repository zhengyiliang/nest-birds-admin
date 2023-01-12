import { message } from 'antd';
import { useRequest } from '@umijs/max';
import { useState } from 'react';
import { updateArticle, getDetail } from '@/services/blog/article';
import { useNavigate, useParams } from '@umijs/max';
import { CreateAndUpdate } from './components';

const Update = () => {
  const navigate = useNavigate();
  const [initialValues, setInitiaValues] = useState();

  const { id } = useParams();

  const { loading, run } = useRequest(updateArticle, {
    manual: true,
    onSuccess({ code }) {
      if (code === 200) {
        message.success('文章更新成功');
        navigate('/blog/article');
      }
    },
  });

  useRequest(() => getDetail({ id }), {
    manual: !id,
    onSuccess({ code, data }) {
      console.log(code, data);
      if (code === 200) {
        setInitiaValues(data);
      }
    },
  });

  // 创建文章

  return (
    <>
      <CreateAndUpdate
        type="update"
        submitLoading={loading}
        initialValues={initialValues}
        onFinish={(data) => {
          run({ ...data, id });
        }}
      />
    </>
  );
};

export default Update;
