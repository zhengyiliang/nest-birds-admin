import type { ProColumns } from '@ant-design/pro-components';
import { Avatar, message, Switch } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ROLE_TYPES, ACCOUNT_STATUS } from '@/constants';
import { updateStatus } from '@/services/sys/user';

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
    valueEnum: ACCOUNT_STATUS,
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
    // fixed: 'left',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    ellipsis: true,
    hideInSearch: true,
    // fixed: 'left',
    width: 60,
    render: (_, { avatar }) => {
      // console.log(val);
      return <Avatar icon={<UserOutlined />} src={avatar} shape="square" />;
    },
  },
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
    fixed: 'left',
    width: 100,
    hideInSearch: true,
  },
  {
    title: '角色',
    dataIndex: 'auth',
    ellipsis: true,
    width: 100,
    hideInSearch: true,
    valueEnum: ROLE_TYPES,
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
    valueEnum: ACCOUNT_STATUS,
    width: 120,
    render: (text, record, _, action) => {
      const { status, id, name } = record;
      return (
        <>
          {text} &nbsp;&nbsp;
          <Switch
            checked={!status}
            onChange={async (val) => {
              const { code } = await updateStatus({
                id,
                status: (!val as any) * 1,
              });
              if (code === 200) {
                message.success(`${name} 用户已${val ? '启用' : '停用'}`);
                action?.reload();
              }
            }}
          />
        </>
      );
    },
  },
];
