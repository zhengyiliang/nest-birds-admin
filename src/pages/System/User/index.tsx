import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProTable,
  ActionType,
} from '@ant-design/pro-components';
import { forms, columns, UserListItem } from './columns';
import { getUserList, deleteUser, resetPassword } from '@/services/sys/user';
import { useState, useRef } from 'react';
import CreateAndUpdate from './components/CreateAndUpdate';
import {
  Button,
  Modal,
  ConfigProvider,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { useRequest } from '@umijs/max';

const User = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [current, setCurrent] = useState<API.User>({});
  const actionRef = useRef<ActionType>();

  const { run } = useRequest(resetPassword, {
    manual: true,
    onSuccess({ code, message: msg }) {
      if (code === 200) {
        message.success(msg);
        actionRef.current?.reload();
      }
    },
  });

  return (
    <>
      <PageContainer>
        <ProTable<UserListItem>
          actionRef={actionRef}
          // loading={loading}
          scroll={{ x: 1000 }}
          // polling={2000}
          columns={[
            ...forms,
            ...columns,
            {
              title: '操作',
              valueType: 'option',
              key: 'option',
              fixed: 'right',
              align: 'center',
              width: 120,
              render: (text, record, index, action) => {
                const { id, name, email, description, auth, status } = record;
                return [
                  <Tooltip title="编辑" key="edit">
                    <Button
                      onClick={() => {
                        setCurrent({
                          id,
                          name,
                          email,
                          description,
                          auth: auth.toString(),
                          status: status.toString(),
                        });
                        setUpdateModalVisible(true);
                      }}
                      size="small"
                      type="primary"
                      icon={<EditOutlined />}
                    />
                  </Tooltip>,
                  <Tooltip title="删除" key="delete">
                    <Button
                      size="small"
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        Modal.confirm({
                          title: '删除提示',
                          icon: <ExclamationCircleOutlined />,
                          content: (
                            <>
                              确定删除&nbsp;&nbsp;
                              <Typography.Text type="warning">
                                {name}
                              </Typography.Text>
                              &nbsp;&nbsp;用户吗，删除后不可恢复
                            </>
                          ),
                          okText: '确认',
                          cancelText: '取消',
                          onOk: async () => {
                            console.log(index, text);
                            const { code } = await deleteUser({
                              id,
                            });
                            if (code === 200) {
                              action?.reload(true);
                            }
                            // return message.error(msg || '删除失败');
                            // TODO 删除当前页最后一条记录页码自动跳到前一页(受控分页器)
                            // 暂时用重置条件来解决
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
                    <Tooltip title="重置密码">
                      <Button
                        size="small"
                        type="primary"
                        icon={<RetweetOutlined />}
                        onClick={() => {
                          Modal.confirm({
                            title: '重置提示',
                            icon: <ExclamationCircleOutlined />,
                            content: (
                              <>
                                确定重置&nbsp;&nbsp;
                                <Typography.Text type="warning">
                                  {name}
                                </Typography.Text>
                                &nbsp;&nbsp;用户的密码吗？
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: 'rgba(0,0,0,0.6)',
                                  }}
                                >
                                  重置后的密码默认为&nbsp;&nbsp;
                                  <Typography.Text type="warning">
                                    z12345
                                  </Typography.Text>
                                </div>
                              </>
                            ),
                            okText: '确认',
                            cancelText: '取消',
                            onOk: () => {
                              run(id);
                            },
                          });
                        }}
                      />
                    </Tooltip>
                  </ConfigProvider>,
                ];
              },
            },
          ]}
          cardBordered
          dateFormatter="string"
          request={async (params) => {
            const { code, data } = await getUserList(params);
            return {
              data: data.list,
              total: data.total,
              success: code === 200,
            };
          }}
          columnsState={{
            persistenceKey: 'user-table',
            persistenceType: 'localStorage',
            onChange(value) {
              console.log('value: ', value);
            },
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
          }}
          options={{
            setting: {
              listsHeight: 400,
            },
          }}
          form={{
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            pageSize: 5,
            onChange: (page) => console.log(page),
          }}
          headerTitle="用户列表"
          toolBarRender={() => [
            <Button
              onClick={() => setCreateModalVisible(true)}
              key="button"
              icon={<PlusOutlined />}
              type="primary"
            >
              新建
            </Button>,
          ]}
        />
      </PageContainer>
      <CreateAndUpdate
        type="create"
        data={{}}
        modalVisible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => {
          actionRef.current?.reload(true);
          setCreateModalVisible(false);
        }}
      />
      <CreateAndUpdate
        data={current}
        type="update"
        onOk={() => {
          actionRef.current?.reload(true);
          setUpdateModalVisible(false);
        }}
        modalVisible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
      />
    </>
  );
};

export default User;
