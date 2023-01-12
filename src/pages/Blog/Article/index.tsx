import {
  PageContainer,
  ProTable,
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import { useRef } from 'react';
import { getArticleList } from '@/services/blog/article';
import { ARTICLE_STATUS } from '@/constants';
import { Button, Image, Modal, Tooltip, Typography } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAccess, useRequest } from '@umijs/max';
import { getAllTag } from '@/services/blog/tag';
import { getAllCategory } from '@/services/blog/category';
import { useState } from 'react';
import { getUserByAuth } from '@/services/sys/user';
import { useNavigate } from '@umijs/max';
import ImgFailed from '@/assets/svg/img-failed.svg';

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
                    fallback={ImgFailed}
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
            {
              title: '操作',
              valueType: 'option',
              key: 'option',
              fixed: 'right',
              align: 'center',
              width: 120,
              render: (...args) => {
                const [, record] = args;
                return [
                  <Tooltip title="查看" key="eye">
                    <Button
                      onClick={() => {}}
                      size="small"
                      type="primary"
                      icon={<EyeOutlined />}
                    />
                  </Tooltip>,
                  <Tooltip title="修改" key="edit">
                    <Button
                      onClick={() => {
                        navigate(`/blog/article/update/${record?.id}`);
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
                          icon: <ExclamationOutlined />,
                          content: (
                            <>
                              确定删除&nbsp;&nbsp;
                              <Typography.Text type="warning"></Typography.Text>
                              &nbsp;&nbsp;文章吗，删除后不可恢复
                            </>
                          ),
                          okText: '确认',
                          cancelText: '取消',
                          onOk: async () => {},
                        });
                      }}
                    />
                  </Tooltip>,
                ];
              },
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
