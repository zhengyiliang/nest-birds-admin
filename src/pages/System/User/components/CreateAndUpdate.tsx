import {
  Modal,
  Form,
  Input,
  Button,
  // Radio,
  Select,
  // Cascader,
  // DatePicker,
  // InputNumber,
  // TreeSelect,
  Switch,
  message,
  Space,
  // Checkbox,
  // Upload,
} from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
import React, { PropsWithChildren, useState } from 'react';
import { ROLE_TYPES } from '@/constants';
import { createUser, updateUser } from '@/services/sys/user';

const { TextArea } = Input;

interface CreateProps {
  modalVisible: boolean;
  onCancel: () => void;
  type: 'create' | 'update';
  data: API.User;
  onOk: (user: API.User) => void;
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
        labelCol={{ span: 4 }}
        onFinish={async (valuse) => {
          const params = {
            ...valuse,
            status: (!valuse.status as any) * 1,
          };
          if (type == 'create') {
            setLoading(true);
            const { code } = await createUser(params);
            setLoading(false);
            if (code == 200) {
              onOk(params);
            }
          }

          if (type == 'update') {
            if (data?.id) {
              setLoading(true);
              const { code } = await updateUser(params, data.id);
              setLoading(false);
              if (code == 200) {
                onOk(params);
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
          label="名称"
          name="name"
          tooltip="名称是唯一key"
          rules={[{ required: true, message: 'name is required' }]}
        >
          <Input bordered={type == 'create'} readOnly={type == 'update'} />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: 'description is required' }]}
        >
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { type: 'email' },
            { required: true, message: 'email is required' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="角色"
          name="auth"
          rules={[{ required: true, message: 'role is required' }]}
        >
          <Select
            options={Object.entries(ROLE_TYPES)
              .map(([key, val]) => ({
                value: key,
                label: val.text,
              }))
              .reverse()}
          />
        </Form.Item>
        <Form.Item label="状态" name="status" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="停用" />
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
