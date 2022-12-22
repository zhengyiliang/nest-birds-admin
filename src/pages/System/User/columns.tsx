import {
  PageContainer,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space, Tag } from 'antd';
import { request, useModel } from '@umijs/max';

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

const columns: ProColumns<UserListItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    hideInSearch: true,
  },
  {
    title: '名称',
    dataIndex: 'name',
    copyable: true,
    ellipsis: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    copyable: true,
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '描述',
    dataIndex: 'description',
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    hideInTable: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '超长'.repeat(50) },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true,
      },
      processing: {
        text: '解决中',
        status: 'Processing',
      },
    },
  },

  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
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
  {
    disable: true,
    title: '状态',
    dataIndex: 'status',
    filters: true,
    onFilter: true,
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default columns;
