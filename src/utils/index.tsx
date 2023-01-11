import { RcFile } from 'antd/es/upload';
import { message, Modal } from 'antd';

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export const uploadValidate = (file: RcFile, cb: () => any = () => {}) => {
  // 格式/大小校验通过
  if (beforeUpload(file)) {
    getBase64(file, (url) => {
      Modal.confirm({
        zIndex: 100000,
        title: file?.name,
        content: (
          <img
            style={{ marginLeft: -34 }}
            height={200}
            width={368}
            alt={file?.name}
            src={url}
          />
        ),
        onOk: cb,
      });
    });
  }
};
