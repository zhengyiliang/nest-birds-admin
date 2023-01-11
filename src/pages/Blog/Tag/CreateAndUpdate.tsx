import { Modal, Form, Input, Button, message, Space } from 'antd';
import React, { PropsWithChildren, useState } from 'react';
import { createTag, updateTag } from '@/services/blog/tag';

const { TextArea } = Input;

interface CreateProps {
  modalVisible: boolean;
  onCancel: () => void;
  type: 'create' | 'update';
  data: Partial<API.Tag>;
  onOk: (user: API.Tag) => void;
}

const titleMap: {
  create: string;
  update: string;
} = {
  create: '新建',
  update: '编辑',
};

const CreateAndUpdate: React.FC<PropsWithChildren<CreateProps>> = (props) => {
  const { modalVisible, onCancel, type = 'create', data, onOk } = props;
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      destroyOnClose
      title={titleMap[type]}
      open={modalVisible}
      maskClosable={false}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form
        size="large"
        labelCol={{ span: 6 }}
        onFinish={async (valuse) => {
          if (type == 'create') {
            setLoading(true);
            const { code } = await createTag(valuse);
            setLoading(false);
            if (code == 200) {
              onOk(valuse);
            }
          }

          if (type == 'update') {
            if (data?.id) {
              setLoading(true);
              const { code } = await updateTag(valuse, data.id);
              setLoading(false);
              if (code == 200) {
                onOk(valuse);
              }
            } else {
              message.error('id 不存在');
            }
          }
        }}
        initialValues={data}
        layout="horizontal"
      >
        <Form.Item
          label="标签名称"
          name="name"
          tooltip="名称是唯一key"
          rules={[{ required: true, message: 'name is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="描述"
          name="desc"
          rules={[{ required: true, message: 'description is required' }]}
        >
          <TextArea rows={2} />
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Space align="center" size="large">
            <Button onClick={onCancel}>取消</Button>
            <Button loading={loading} type="primary" htmlType="submit">
              提交
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateAndUpdate;
