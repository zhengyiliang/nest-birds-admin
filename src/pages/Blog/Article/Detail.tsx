import ReactMarkdown from 'react-markdown';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Skeleton, Row, Col, Affix, List, Avatar, Badge } from 'antd';
import { useParams, useRequest } from '@umijs/max';
import { getContent } from '@/services/blog/article';
import { useState } from 'react';
import { CodeBlock } from './components';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import MarkNav from 'markdown-navbar';
import dayjs from 'dayjs';
import 'markdown-navbar/dist/navbar.css';
import 'katex/dist/katex.min.css';
import './index.less';
import { UserOutlined } from '@ant-design/icons';

const Detail = () => {
  const [data, setData] = useState<{
    status?: number;
    content?: string;
    user?: API.User;
    updated_at?: string;
  }>({});

  const { id } = useParams();

  const { loading } = useRequest(() => getContent({ id }), {
    manual: !id,
    onSuccess({ code, data }) {
      if (code === 200) {
        setData(data);
      }
    },
  });

  return (
    <PageContainer title={false}>
      <Skeleton loading={loading} active avatar>
        <Row gutter={20}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card bordered>
              <List
                itemLayout="horizontal"
                className="article-header"
                dataSource={[data]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size="large"
                          icon={<UserOutlined />}
                          src={item.user?.avatar || null}
                        />
                      }
                      title={item.user?.name}
                      description={dayjs(item?.updated_at).format(
                        'YYYY-MM-DD hh:mm:ss',
                      )}
                    />
                    <Badge
                      text={item.status === 0 ? '已发布' : '草稿'}
                      status={item.status === 1 ? 'warning' : 'success'}
                    />
                  </List.Item>
                )}
              />
              <ReactMarkdown
                className="markdown-body"
                remarkPlugins={[
                  remarkMath,
                  [remarkGfm, { singleTilde: false }],
                ]}
                rehypePlugins={[rehypeRaw, rehypeKatex]} // 识别html标签
                components={{
                  code: CodeBlock,
                }}
              >
                {`${data?.content}`}
              </ReactMarkdown>
            </Card>
          </Col>
          <Col xl={8} className="lg-none">
            <Affix offsetTop={20}>
              <Card className="article-menu" title="目录">
                <MarkNav source={data?.content} />
              </Card>
            </Affix>
          </Col>
        </Row>
      </Skeleton>
    </PageContainer>
  );
};

export default Detail;
