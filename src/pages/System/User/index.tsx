import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { forms, columns, UserListItem } from './columns';
import { getUserList } from '@/services/sys/user';
import { useState } from 'react';
import Create from './components/Create';
// import { useState } from 'react';

const User = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);

  return (
    <>
      <PageContainer>
        <ProTable<UserListItem>
          // loading={loading}
          scroll={{ x: 1300 }}
          columns={[...forms, ...columns]}
          cardBordered
          // onLoadingChange={(loading) => {
          //   console.log(loading);
          //   setLoading(!!loading);
          // }}
          // dateFormatter={(value, valueType) => {
          //   console.log('====>', value, valueType);
          //   return value.format('YYYYMMDD HH:mm:ss');
          // }}
          dateFormatter="string"
          request={async (params, sort, filter) => {
            console.log(sort, filter);
            const { code, data } = await getUserList(params);
            return {
              data: data.list,
              total: data.total,
              success: code === 200,
            };
          }}
          editable={{
            type: 'multiple',
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
      <Create
        modalVisible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
      />
    </>
  );
};

export default User;
