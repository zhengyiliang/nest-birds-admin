import type { ProColumns } from '@ant-design/pro-components';
import {
  Avatar,
  Button,
  ConfigProvider,
  Modal,
  message,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { deleteUser } from '@/services/sys/user';
import { ROLE_TYPES, ACCOUNT_STATUS } from '@/constants';
// import

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
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    ellipsis: true,
    hideInSearch: true,
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
    render: (text, { id, name }, index, action) => [
      <Tooltip title="编辑" key="edit">
        <Button size="small" type="primary" icon={<EditOutlined />} />
      </Tooltip>,
      <Tooltip title="删除" key="delete">
        <Button
          size="small"
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={async () => {
            Modal.confirm({
              title: '删除提示',
              icon: <ExclamationCircleOutlined />,
              content: (
                <>
                  确定删除&nbsp;&nbsp;
                  <Typography.Text type="warning">{name}</Typography.Text>
                  &nbsp;&nbsp;用户吗，删除后不可恢复
                </>
              ),
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                console.log(index, text);
                const { code, message: msg } = await deleteUser({ id });
                if (code !== 200) return message.error(msg || '删除失败');
                // if (index === 1) {
                // }
                // TODO 删除当前页最后一条记录页码自动跳到前一页(受控分页器)
                // 暂时用重置条件来解决
                action?.reload(true);
                // console.log(_, action, 'delete');
              },
            });
          }}
        />
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
