import type { ProColumns } from '@ant-design/pro-components';
import { Avatar, Button, ConfigProvider, Switch, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const valueEnum = {
  1: {
    text: '停用',
    status: 'Error',
  },
  0: {
    text: '正常',
    status: 'Success',
  },
};

export type UserListItem = {
  id: number;
  name: string;
  avatar: string;
  email: string;
  description: string;
  auth: number;
  created_at: string;
  status: number;
};

export const forms: ProColumns<UserListItem>[] = [
  {
    title: '名称',
    // dataIndex: 'name',
    key: 'keywords',
    hideInTable: true,
  },
  {
    title: '状态',
    key: 'status',
    hideInTable: true,
    valueType: 'select',
    valueEnum,
  },
  {
    title: '创建时间',
    key: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
];

export const columns: ProColumns<UserListItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
    hideInSetting: true,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    ellipsis: true,
    hideInSearch: true,
    width: 60,
    render: (_, { avatar }) => {
      // console.log(val);
      return <Avatar src={avatar} shape="square" />;
    },
  },
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 100,
    hideInSearch: true,
  },
  {
    title: '角色',
    dataIndex: 'auth',
    ellipsis: true,
    width: 100,
    hideInSearch: true,
    valueEnum: {
      32: { text: '超级管理员' },
      16: { text: '管理员' },
      8: { text: '普通用户' },
    },
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    ellipsis: true,
    hideInSearch: true,
    width: 160,
  },
  {
    title: '描述',
    dataIndex: 'description',
    hideInSearch: true,
    width: 120,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateTime',
    width: 120,
    // sorter: true,
    hideInSearch: true,
  },

  {
    title: '状态',
    dataIndex: 'status',
    hideInSearch: true,
    valueEnum,
    width: 120,
    render: (text, { status }) => {
      return (
        <>
          {text} &nbsp;&nbsp;
          <Switch
            // checkedChildren="开"
            // unCheckedChildren="关"
            checked={!status}
          />
        </>
      );
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    fixed: 'right',
    width: 120,
    render: (/* text, record, _, action */) => [
      <Tooltip title="编辑" key="edit">
        <Button size="small" type="primary" icon={<EditOutlined />} />
      </Tooltip>,
      <Tooltip title="删除" key="delete">
        <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
      </Tooltip>,
      <ConfigProvider
        key="setting"
        theme={{
          token: {
            colorPrimary: '#e6a23c',
          },
        }}
      >
        <Tooltip title="设置角色">
          <Button size="small" type="primary" icon={<SettingOutlined />} />
        </Tooltip>
      </ConfigProvider>,
      // <a
      //   key="editable"
      //   onClick={() => {
      //     action?.startEditable?.(record.id);
      //   }}
      // >
      //   编辑
      // </a>,
      // <a target="_blank" rel="noopener noreferrer" key="view">
      //   删除
      // </a>,
      // <TableDropdown
      //   key="actionGroup"
      //   onSelect={() => action?.reload()}
      //   menus={[{ key: 'delete', name: '删除' }]}
      // />,
    ],
  },
];
