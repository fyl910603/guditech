import * as React from 'react';
import { companyName } from 'utils/constant';
import styles from './styles.less';

export function Footer() {
  return (
    <React.Fragment>
      <div className={styles.footer}>
        <div className={styles.copyright}>
          {companyName}©2017-2018 guditech.com 版权所有 浙ICP备18005644号-1
        </div>
      </div>
    </React.Fragment>
  );
}

export function FooterSpace() {
  return <div className={styles.footerSpace} />;
}
