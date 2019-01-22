import * as React from 'react';
import styles from './styles.less';
import { getUser } from 'utils/localStore';

export interface Props {
  type: 1 | 2; // 1: 头像 2: 营业执照
  url: string;
}

export function LicenseShow(props: Props) {
  const { url, type } = props;

  let user = getUser();
  let userToken = user ? user.UserToken : undefined;


  // 当照片是 营业执照 时，有个默认图片

  const url1 = (url || '').replace(/\\/g, '/');

  return (
    <div className={type === 1 ? styles.picBorderHeader : styles.picBorderBusinessLicense}>
      <div
        className={styles.pic}
        style={{ backgroundImage: `url(${url1}?userToken=${userToken})` }}
      />
    </div>
  );
}
