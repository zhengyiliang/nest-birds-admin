import {
  PageContainer,
  ProTable,
  ActionType,
} from '@ant-design/pro-components';
import { Button, Tooltip, Modal, Typography } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useState, useRef } from 'react';
import { deleteCategory, getCategoryList } from '@/services/blog/category';
import CreateAndUpdate from './CreateAndUpdate';

export type CategoryListItem = {
  id: number;
  name: string;
  description: string;
  create_by?: string;
  created_at?: number;
  update_by?: string;
};

const Category = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [current, setCurrent] = useState<Partial<API.Category>>({});
  const actionRef = useRef<ActionType>();

  return (
    <>
      <PageContainer>
        <ProTable<CategoryListItem>
          actionRef={actionRef}
          request={async (params) => {
            const { code, data } = await getCategoryList(params);
            return {
              data: data.list,
              total: data.total,
              success: code === 200,
            };
          }}
          cardBordered
          rowKey="id"
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
          }}
          scroll={{ x: 1000 }}
          search={false}
          headerTitle="分类列表"
          columns={[
            {
              dataIndex: 'index',
              hideInSetting: true,
              valueType: 'indexBorder',
              width: 48,
            },
            {
              title: '分类名称',
              width: 120,
              dataIndex: 'name',
            },
            {
              title: '分类描述',
              width: 120,
              dataIndex: 'description',
              ellipsis: true,
            },
            {
              title: '创建者',
              width: 120,
              dataIndex: 'create_by',
            },
            {
              title: '最后更新者',
              width: 120,
              dataIndex: 'update_by',
            },
            {
              title: '创建时间',
              width: 160,
              dataIndex: 'created_at',
              valueType: 'dateTime',
            },
            {
              title: '操作',
              width: 80,
              valueType: 'option',
              key: 'option',
              align: 'center',
              fixed: 'right',
              render: (...args) => {
                const [, { id, name, description }, , action] = args;
                return [
                  <Tooltip title="编辑" key="edit">
                    <Button
                      onClick={() => {
                        setCurrent({ id, name, description });
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
                              &nbsp;&nbsp;分类吗，删除后不可恢复
                            </>
                          ),
                          okText: '确认',
                          cancelText: '取消',
                          onOk: async () => {
                            const { code } = await deleteCategory({
                              id,
                            });
                            if (code === 200) {
                              action?.reload(true);
                            }
                          },
                        });
                      }}
                    />
                  </Tooltip>,
                ];
              },
            },
          ]}
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

export default Category;
