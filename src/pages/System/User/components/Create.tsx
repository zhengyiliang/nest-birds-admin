import {
  Modal,
  Form,
  Input,
  // Button,
  // Radio,
  Select,
  // Cascader,
  // DatePicker,
  // InputNumber,
  // TreeSelect,
  Switch,
  // Checkbox,
  Upload,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { PropsWithChildren } from 'react';
import { ROLE_TYPES } from '@/constants';

const { TextArea } = Input;

interface CreateProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const Create: React.FC<PropsWithChildren<CreateProps>> = (props) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="新建"
      open={modalVisible}
      maskClosable={false}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form
        size="large"
        labelCol={{ span: 4 }}
        // wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item label="头像" valuePropName="fileList">
          <Upload action="/upload.do" listType="picture-card">
            <PlusOutlined />
          </Upload>
        </Form.Item>
        <Form.Item label="名称" tooltip="名称是唯一key">
          <Input />
        </Form.Item>
        <Form.Item label="角色">
          <Select
            options={Object.entries(ROLE_TYPES).map(([key, val]) => ({
              value: key,
              label: val.text,
            }))}
          />
        </Form.Item>
        <Form.Item label="邮箱" rules={[{ type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="描述">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="状态" valuePropName="status">
          <Switch checkedChildren="启用" unCheckedChildren="停用" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Create;
