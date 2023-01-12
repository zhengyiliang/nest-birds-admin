import { FC, useState } from 'react';
import {
  Form,
  Upload,
  message,
  Image,
  Modal,
  Input,
  Space,
  FormInstance,
} from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import '../index.less';
import { uploadValidate } from '@/utils';
import { deleteCover, uploadCover } from '@/services/blog/article';
import ImgFailed from '@/assets/svg/img-failed.svg';

interface UploadCoverProps {
  form: FormInstance;
}

const UploadCover: FC<UploadCoverProps> = (props) => {
  const { form } = props;

  const [visible, setVisible] = useState(false);

  const [coverType, setCoverType] = useState('upload');

  const [upLoading, setUpLoading] = useState(false);

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      setUpLoading(false);
      form?.setFieldValue('cover', info.file.response);
      message.success('上传成功');
    }
  };

  const cover = form?.getFieldValue('cover');

  const [preCover, setPreCover] = useState(cover);

  const delCover = async (cb?: () => void, text?: string) => {
    if (preCover) {
      Modal.confirm({
        title: '删除提示',
        content: text ?? '确定删除已上传的图片吗? 此操作不可逆转',
        onOk: async () => {
          const { code } = await deleteCover({
            filename: preCover,
          });
          if (code === 200) {
            form.setFieldValue('cover', null);
            setPreCover(undefined);
            message.success('删除成功');
            // cb && cb();
            if (cb) {
              cb();
            }
          }
        },
      });
    } else {
      form.setFieldValue('cover', null);
      setPreCover(undefined);
      if (cb) {
        cb();
      }
    }
    return;
  };

  return (
    <>
      <Form.Item
        htmlFor=""
        tooltip="点击标签切换操作模式"
        className={coverType === 'upload' ? 'upload-form-item' : ''}
        label={
          <span
            style={{ cursor: 'pointer' }}
            onClick={async () => {
              delCover(() => {
                setCoverType(coverType === 'upload' ? 'address' : 'upload');
              }, '切换模式将删除已上传的图片吗? 此操作不可逆转');
            }}
          >
            上传封面
          </span>
        }
        name="cover"
        style={{ position: 'relative' }}
        rules={
          coverType === 'upload'
            ? [{ required: true, message: '请上传封面' }]
            : [
                { required: true, message: '请上传封面' },
                { type: 'url', message: '格式不正确' },
              ]
        }
        valuePropName={coverType === 'upload' ? 'name' : 'value'}
      >
        {coverType === 'upload' ? (
          <Upload
            name="cover"
            className="custom-upload"
            showUploadList={false}
            listType="picture-card"
            maxCount={1}
            onChange={handleChange}
            // fileList={}
            customRequest={async (options) => {
              const { file } = options as any;
              uploadValidate(file, async () => {
                setUpLoading(true);
                if (preCover) {
                  const { code: delCode } = await deleteCover({
                    filename: preCover,
                  });
                  if (delCode !== 200) {
                    setUpLoading(false);
                    return message.error('上传之前删除失败');
                  }
                }
                const params = new FormData();
                params.append('cover', options.file);
                const { code, data } = await uploadCover(params);
                if (code === 200 && options?.onSuccess) {
                  setPreCover(data);
                  options?.onSuccess(data);
                } else {
                  setUpLoading(false);
                  setPreCover(undefined);
                  // message.error('上传失败');
                }
              });
            }}
          >
            {typeof cover === 'string' && cover ? (
              <Image
                onClick={(e) => {
                  e.stopPropagation();
                }}
                width="100%"
                fallback={ImgFailed}
                height="100%"
                src={cover}
                alt="封面"
                preview={{
                  visible,
                  onVisibleChange: (val, pre) => {
                    if (pre) {
                      setVisible(val);
                    }
                  },
                  mask: (
                    <Space>
                      <EyeOutlined
                        style={{ fontSize: 16 }}
                        onClick={() => {
                          setVisible(true);
                        }}
                      />
                      <DeleteOutlined
                        style={{ fontSize: 16 }}
                        onClick={async () => {
                          delCover();
                        }}
                      />
                    </Space>
                  ),
                }}
              />
            ) : (
              <>
                {upLoading ? (
                  <LoadingOutlined />
                ) : (
                  <>
                    <PlusOutlined /> 上传封面
                  </>
                )}
              </>
            )}
          </Upload>
        ) : (
          <Input />
        )}
      </Form.Item>
    </>
  );
};

export default UploadCover;
