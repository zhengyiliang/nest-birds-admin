import { PageContainer } from '@ant-design/pro-components';
import {
  Card,
  Col,
  Button,
  Form,
  Input,
  Radio,
  Space,
  Row,
  Modal,
  Select,
} from 'antd';
import Editor from 'for-editor';
import { useForm } from 'antd/es/form/Form';
import { useModel, useRequest } from '@umijs/max';
import { getAllTag } from '@/services/blog/tag';
import { getAllCategory } from '@/services/blog/category';
import { FC, useState } from 'react';
import { initialStateProps } from '@/app';
import { uploadImg } from '@/services/blog/article';
import { UploadCover } from '.';
import { uploadValidate } from '@/utils';
import { useNavigate } from '@umijs/max';

interface CreateAndUpdateProps {
  onFinish: (values: any) => void;
  initialValues: any;
  submitLoading: boolean;
  type: 'create' | 'update';
}

const CreateAndUpdate: FC<CreateAndUpdateProps> = (props) => {
  const { onFinish, initialValues, submitLoading, type } = props;
  const { initialState } = useModel('@@initialState');
  const user: initialStateProps['user'] = initialState?.user;
  const navigate = useNavigate();

  // const [initValue, setInitValue] = useState({
  //   isTop: '0',
  //   isHot: '0',
  //   isPublic: '1',
  //   status: '0',
  // });

  // const { id } = useParams();
  // console.log(params);

  // useEffect(() => )

  const [form] = useForm();
  const [tagOptions, setTagOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // const { loading: updateLoading, run: update } = useRequest(updateArticle, {
  //   manual: true,
  //   onSuccess() {},
  // });

  // 获取所有标签
  const { loading: tagLoading } = useRequest(getAllTag, {
    onSuccess({ code, data }) {
      if (code === 200) {
        setTagOptions(data);
      }
    },
  });

  // 获取所有分类
  const { loading: catLoading } = useRequest(getAllCategory, {
    onSuccess({ code, data }) {
      if (code === 200) {
        setCategoryOptions(data);
      }
    },
  });

  // 上传图片
  const addImg = (file: any) => {
    uploadValidate(file, async () => {
      const params = new FormData();
      params.append('file', file);
      const { code, data } = await uploadImg(params);
      if (code === 200) {
        const content = form.getFieldValue('content');
        form.setFieldValue('content', `${content ?? ''}![alt](${data})\n\n`);
      }
    });
  };

  // // 创建文章
  // const { loading, run: create } = useRequest(createArticle, {
  //   manual: true,
  //   onSuccess({ code }) {
  //     console.log(code);
  //     if (code === 200) {
  //       message.success('文章创建成功');
  //       navigate('/blog/article');
  //     }
  //   },
  // });

  return (
    <>
      <PageContainer title={false}>
        <Card bordered>
          <Form
            key={initialValues}
            form={form}
            labelCol={{ span: 10 }}
            onFinish={onFinish}
            initialValues={initialValues}
          >
            <Row>
              <Col span={8}>
                <Form.Item label="作者">
                  <Input defaultValue={user?.name} readOnly bordered={false} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="标题"
                  name="title"
                  rules={[{ required: true, message: '请输入标题' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <UploadCover form={form} key={form.getFieldValue('cover')} />
              </Col>
              <Col span={8}>
                <Form.Item
                  label="描述"
                  name="description"
                  rules={[{ required: true, message: '请输入描述' }]}
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="所属分类"
                  name="categoryId"
                  rules={[{ required: true, message: '请选择分类' }]}
                >
                  <Select
                    fieldNames={{
                      label: 'name',
                      value: 'id',
                    }}
                    loading={catLoading}
                    options={categoryOptions}
                    placeholder="请选择分类"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="关联标签"
                  name="tags"
                  rules={[{ required: true, message: '请选择标签' }]}
                >
                  <Select
                    fieldNames={{
                      label: 'name',
                      value: 'id',
                    }}
                    loading={tagLoading}
                    options={tagOptions}
                    mode="tags"
                    placeholder="请选择标签"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <Form.Item label="是否置顶" name="isTop">
                  <Radio.Group>
                    <Radio value="1"> 是 </Radio>
                    <Radio value="0"> 否 </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="是否热门" name="isHot">
                  <Radio.Group>
                    <Radio value="1"> 是 </Radio>
                    <Radio value="0"> 否 </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <Form.Item label="是否开源" name="isPublic">
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="1"> 公开 </Radio.Button>
                    <Radio.Button value="0"> 私密 </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="状态" name="status">
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="1"> 发布 </Radio.Button>
                    <Radio.Button value="0"> 草稿 </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="content"
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <Editor preview={true} subfield={true} addImg={addImg} />
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Space align="center" size="large">
                <Button
                  size="large"
                  onClick={() => {
                    if (form.isFieldsTouched()) {
                      Modal.confirm({
                        title: '提示',
                        content: '请确认是否要离开本页面? 您的内容尚未保存',
                        onOk: () => {
                          navigate(-1);
                        },
                      });
                    } else {
                      navigate(-1);
                    }
                  }}
                >
                  返回
                </Button>
                <Button
                  loading={submitLoading}
                  size="large"
                  type="primary"
                  htmlType="submit"
                >
                  {type === 'create' ? '提交' : '保存'}
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      </PageContainer>
    </>
  );
};

export default CreateAndUpdate;
