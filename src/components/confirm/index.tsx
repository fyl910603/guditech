import * as React from 'react';
import { Modal } from 'antd';
import styles from './styles.less';

export interface Props {
  title: string;
  onOk?: () => void;
}

export function confirm(props: Props) {
  const { title, onOk } = props;

  const content = (
    <div className={styles.content}>
      <div className={styles.title}>{title}</div>
    </div>
  );

  Modal.confirm({
    centered: true,
    className: styles.modalSuccess,
    content: content,
    cancelText: '取消',
    okText: '确定',
    onOk,
  });
}
