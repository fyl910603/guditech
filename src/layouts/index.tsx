import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import { Crumb } from 'components/crumb';
import { Header, HeaderSpace } from 'components/header';
import { getUser } from 'utils/localStore';
import router from 'umi/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import { namespace as indexNamespace } from '../models/index';

import 'moment/locale/zh-cn';
import { Footer, FooterSpace } from 'components/footer';
moment.locale('zh-cn');

function Component(props) {
  const { location, children, user, dispatch } = props;
  switch (location.pathname) {
    case '/login':
    case '/forget':
    case '/register':
    case '/':
      return children;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  function onLogout() {
    dispatch({
      type: `${indexNamespace}/logout`,
      payload: {},
    });
  }

  return (
    <LocaleProvider locale={zhCN}>
      <div className={styles.page}>
        <Header user={user} type="normal" onLogout={onLogout}/>
        <HeaderSpace />
        <div className={styles.main}>
          <div className={styles.body}>
            <Crumb />
            <div className={styles.content}>{children}</div>
          </div>
        </div>
        <Footer />
        <FooterSpace />
      </div>
    </LocaleProvider>
  );
}

const mapStateToProps = state => {
  const user = getUser();
  return {
    user: user,
  };
};

export default withRouter(connect(mapStateToProps)(Component));
