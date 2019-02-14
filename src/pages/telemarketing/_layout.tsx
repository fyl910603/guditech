import * as React from 'react';
import styles from './styles.less';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import { getUser } from 'utils/localStore';
import { Menu, MenuDataItem } from 'components/menu';
import { Icon } from 'antd';
import router from 'umi/router';

function Component(props) {
  const { location, children, user } = props;

  const menuList: MenuDataItem[] = [
    {
      icon: <Icon type="mail" />,
      text: '电话营销',
      url: '/telemarketing/teleListForCall',
    },
    {
      icon: <Icon type="appstore" />,
      text: '拨打记录',
      url: '/telemarketing/callRecordList',
    },
  ];

  function onMenuClick(url: string) {
    if(url.indexOf('?clear=1') == -1){
      router.push(url + '?clear=1');
    }
  }

  const isSHowMenu = menuList.find(item => item.url === location.pathname);

  return (
    <div className={styles.page}>
      {isSHowMenu && (
        <div className={styles.menu}>
          <Menu list={menuList} current={location.pathname} onClick={onMenuClick} />
        </div>
      )}

      <div className={styles.content}>{children}</div>
    </div>
  );
}

const mapStateToProps = state => {
  const user = getUser();
  return {
    user: user,
  };
};

export default withRouter(connect(mapStateToProps)(Component));
