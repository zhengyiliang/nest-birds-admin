import { message } from 'antd';
import { useRequest } from '@umijs/max';
import { createArticle } from '@/services/blog/article';
import { useNavigate } from '@umijs/max';
import { CreateAndUpdate } from './components';

const Create = () => {
  const navigate = useNavigate();

  // 创建文章
  const { loading, run: create } = useRequest(createArticle, {
    manual: true,
    onSuccess({ code }) {
      if (code === 200) {
        message.success('文章创建成功');
        navigate('/blog/article');
      }
    },
  });

  return (
    <>
      <CreateAndUpdate
        type="create"
        submitLoading={loading}
        initialValues={{
          isTop: '0',
          isHot: '0',
          isPublic: '1',
          status: '0',
        }}
        onFinish={(data) => {
          create(data);
        }}
      />
    </>
  );
};

export default Create;
