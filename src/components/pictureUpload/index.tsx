import * as React from "react";
import { Button, Upload, Icon } from 'antd';
import { getPicUploadProps } from 'utils/ask';
import styles from './styles.less';

export function PictureUpload(props) {
  const { type, onSuccess, onError, title } = props;

  return (
    <Upload {...getPicUploadProps({ type, onSuccess, onError })} className={styles.upload} showUploadList={false}>
      <Button className={styles.btnUpload}>
        <Icon type="upload" /> {title}
      </Button>
    </Upload>
  );
}
