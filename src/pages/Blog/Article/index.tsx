import {
  PageContainer,
  ProTable,
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import { useRef } from 'react';
import { getArticleList } from '@/services/blog/article';
import { ARTICLE_STATUS } from '@/constants';
import { Button, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAccess, useRequest } from '@umijs/max';
import { getAllTag } from '@/services/blog/tag';
import { getAllCategory } from '@/services/blog/category';
import { useState } from 'react';
import { getUserByAuth } from '@/services/sys/user';
import { useNavigate } from '@umijs/max';

const enumMap = (data: { id: number; name: string }[]) => {
  return data?.reduce((pre, cur) => {
    return { ...pre, [cur.id]: { text: cur.name } };
  }, {});
};

const Article = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [tagEnum, setTagEnum] = useState({});
  const [userEnum, setUserEnum] = useState({});
  const [categoryEnum, setCategoryEnum] = useState({});
  // 获取所有标签
  useRequest(getAllTag, {
    onSuccess({ code, data }) {
      if (code === 200) {
        setTagEnum(enumMap(data));
      }
    },
  });

  // 获取所有分类
  useRequest(getAllCategory, {
    onSuccess({ code, data }) {
      if (code === 200) {
        setCategoryEnum(enumMap(data));
      }
    },
  });

  // 根据权限获取用户
  useRequest(getUserByAuth, {
    manual: access.self,
    onSuccess({ code, data }) {
      if (code === 200) {
        setUserEnum(enumMap(data));
      }
    },
  });

  const searchColumns: ProColumns[] = [
    {
      dataIndex: 'keyword',
      hideInTable: true,
      title: '关键字',
    },
    {
      dataIndex: 'userId',
      hideInTable: true,
      title: '作者',
      valueType: 'select',
      valueEnum: userEnum,
    },
    {
      dataIndex: 'categoryId',
      hideInTable: true,
      title: '所属分类',
      valueType: 'select',
      valueEnum: categoryEnum,
    },
    {
      dataIndex: 'tagIds',
      hideInTable: true,
      title: '关联标签',
      valueType: 'select',
      fieldProps: { mode: 'tags' },
      valueEnum: tagEnum,
    },
    {
      dataIndex: 'isTop',
      hideInTable: true,
      title: '是否置顶',
      valueType: 'select',
      valueEnum: {
        1: { text: '是' },
        0: { text: '否' },
      },
    },
    {
      dataIndex: 'isHot',
      hideInTable: true,
      title: '是否热门',
      valueType: 'select',
      valueEnum: {
        1: { text: '是' },
        0: { text: '否' },
      },
    },
    {
      dataIndex: 'isPublic',
      hideInTable: true,
      title: '是否开源',
      valueType: 'select',
      valueEnum: {
        1: { text: '公开' },
        0: { text: '私密' },
      },
    },
    {
      dataIndex: 'status',
      hideInTable: true,
      title: '状态',
      valueType: 'select',
      valueEnum: {
        1: { text: '发布' },
        0: { text: '草稿' },
      },
    },
  ];

  return (
    <>
      <PageContainer>
        <ProTable
          rowKey="id"
          scroll={{ x: 1000 }}
          actionRef={actionRef}
          columns={[
            ...searchColumns.filter((x) => {
              if (access.self && x.dataIndex === 'userId') {
                return false;
              }
              return true;
            }),
            {
              dataIndex: 'index',
              valueType: 'indexBorder',
              width: 48,
              hideInSetting: true,
              hideInSearch: true,
            },
            {
              title: '封面',
              dataIndex: 'cover',
              hideInSearch: true,
              hideInSetting: true,
              width: 96,
              render: (_, { cover }) => {
                return (
                  <Image
                    height={40}
                    width={80}
                    src={cover || 'error'}
                    preview={!!cover}
                    fallback="data:image/png;base64,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"
                  />
                );
              },
            },
            {
              title: '标题',
              dataIndex: 'title',
              hideInSearch: true,
              hideInSetting: true,
              ellipsis: true,
              width: 120,
            },
            {
              title: '描述',
              dataIndex: 'description',
              hideInSearch: true,
              ellipsis: true,
              hideInSetting: true,
              width: 120,
            },
            {
              title: '作者',
              dataIndex: ['user', 'name'],
              hideInSearch: true,
              hideInSetting: true,
              width: 100,
            },
            {
              title: '所属分类',
              dataIndex: ['category', 'name'],
              hideInSearch: true,
              hideInSetting: true,
              width: 120,
            },
            {
              title: '关联标签',
              dataIndex: 'tag',
              hideInSearch: true,
              hideInSetting: true,
              width: 120,
            },
            {
              title: '浏览数',
              dataIndex: 'views',
              hideInSearch: true,
              hideInSetting: true,
              width: 80,
            },
            {
              title: '状态',
              dataIndex: 'status',
              hideInSearch: true,
              hideInSetting: true,
              valueEnum: ARTICLE_STATUS,
              width: 80,
            },
            {
              title: '创建时间',
              dataIndex: 'created_at',
              valueType: 'dateTime',
              hideInSearch: true,
              hideInSetting: true,
              width: 160,
            },
            {
              title: '修改时间',
              dataIndex: 'updated_at',
              valueType: 'dateTime',
              hideInSearch: true,
              hideInSetting: true,
              width: 160,
            },
          ]}
          request={async (params) => {
            const { code, data } = await getArticleList(params as any);
            return {
              data: data.list,
              total: data.total,
              success: code === 200,
            };
          }}
          toolBarRender={() => [
            <Button
              // onClick={() => setCreateModalVisible(true)}
              key="button"
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                navigate('/blog/article/create');
              }}
            >
              新建
            </Button>,
          ]}
          headerTitle="文章列表"
        />
      </PageContainer>
    </>
  );
};

export default Article;
