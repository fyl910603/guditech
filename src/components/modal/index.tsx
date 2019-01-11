import * as React from 'react';
import { Modal } from 'antd';
import styles from './styles.less';

export interface Props {
  title?: string;
  message?: string;
  pic?: string;
  onOk?: () => void;
}

export function modalSuccess(props: Props) {
  const { title, message, pic, onOk } = props;

  const content = (
    <div className={styles.content}>
      {title &&  <div className={styles.title}>{title}</div> }
      {message && <div className={styles.message}>{message}</div>}
      {pic && <div className={styles.pic} style={{ backgroundImage: `url(${pic})` }} />}
    </div>
  );

  Modal.success({
    centered: true,
    className: styles.modalSuccess,
    content: content,
    width: 420,
    okText: '确定',
    onOk,
  });
}
