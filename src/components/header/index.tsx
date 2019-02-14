import * as React from 'react';
import { Icon, Dropdown, Menu } from 'antd';
import styles from './styles.less';
import { User } from 'utils/User';
import router from 'umi/router';

export interface Props {
  user: User;
  type: 'index' | 'normal';
  onLogout: () => void;
}

export function Header(props: Props) {
  function onMenuClick({ key }) {
    switch (key) {
      case '1':
        router.push('/business');
        break;
      case '2':
        router.push('/changePhone');
        break;
      case '3':
        router.push('/changePassword');
        break;
      case '4':
        router.push('/sinks');
        break;
      case '6':
        router.push('/phone');
        break;
      case '5': {
        props.onLogout();
        break;
      }
    }
  }
  function toHelp(){
    router.push('/help');
  }
  function toBusinessCenter() {
    router.push('/business');
  }
  function toRecharge() {
    router.push('/recharge');
  }
  function toBalance() {
    if (!document.location.href.endsWith('/balanceChangeList')) {
      router.push('/balanceChangeList');
    }
  }
  const menu = (
    <Menu className={styles.dropdownMenu} onClick={onMenuClick}>
      <Menu.Item key="1">
        <Icon type="user" />
        商户中心
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="phone" />
        修改手机号
      </Menu.Item>
      <Menu.Item key="3">
        <Icon type="lock" />
        修改密码
      </Menu.Item>
      <Menu.Item key="4">
        <Icon type="line-chart" />
        短信业务
      </Menu.Item>
      <Menu.Item key="6">
        <Icon type="phone" />
        电话业务
      </Menu.Item>
      <Menu.Item key="5">
        <Icon type="poweroff" />
        退出
      </Menu.Item>
    </Menu>
  );

  const { user, type } = props;

  const companyNameStyle: any = {};
  if (user.AccountHeadImg) {
    companyNameStyle.backgroundImage = `url(${user.AccountHeadImg})`;
  }

  return (
    <div className={type === 'index' ? styles.header : styles.headerNormal}>
      <div className={styles.companyName} style={companyNameStyle} onClick={toBusinessCenter}>
        {user.NickName}
      </div>
      <div className={styles.balance} onClick={toBalance}>
        当前账户余额：{(parseFloat(user.BasicMoney)/ 100).toFixed(2)}元
      </div>
      <div className={styles.recharge} onClick={toRecharge}>
        充值
      </div>
      <div className={styles.setting}>
        <div className={styles.help} onClick={toHelp}>
          <Icon type="question-circle" className={styles.helpIcon}/>
          帮助中心
        </div>
        <div>
        <Dropdown overlay={menu} className={styles.dropDown}>
          <div>
            <Icon type="setting" className={styles.down} />
            设置
          </div>
        </Dropdown>
        </div>
      </div>
    </div>
  );
}

export function HeaderSpace() {
  return <div className={styles.headerSpace} />;
}
