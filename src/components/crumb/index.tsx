import * as React from 'react';
import styles from './styles.less';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import NavLink from 'umi/navlink';

const routes = [
  { path: '/', breadcrumb: '首页' },
  { path: '/changePassword', breadcrumb: '修改密码' },
  { path: '/changePhone', breadcrumb: '修改手机号' },
  { path: '/recharge', breadcrumb: '账户充值' },
  { path: '/recharge/alipay', breadcrumb: '支付宝支付' },
  { path: '/recharge/weChat', breadcrumb: '微信支付' },
  { path: '/recharge/rechargelog', breadcrumb: '充值记录' },
  { path: '/recharge/rechargeSuccess', breadcrumb: '支付成功' },
  { path: '/recharge/rechargeFail', breadcrumb: '支付失败' },
  { path: '/shortMessage', breadcrumb: 'NULL' },
  { path: '/shortMessage/templateList', breadcrumb: '短信模板' },
  { path: '/shortMessage/templateListForSend', breadcrumb: '短信发送' },
  { path: '/shortMessage/templateListForSend/send', breadcrumb: '短信发送' },
  { path: '/shortMessage/templateListForSend/orderList', breadcrumb: '订单记录' },
  { path: '/shortMessage/templateListForSend/orderList/sendList', breadcrumb: '发送记录' },
  { path: '/shortMessage/templateListForSend/orderList/visitList', breadcrumb: '访问详情' },
  { path: '/balanceChangeList', breadcrumb: '余额变更记录' },




  { path: '/business', breadcrumb: '商户中心' },
  { path: '/customer', breadcrumb: '客户管理' },
  { path: '/sinks', breadcrumb: '短信业务' },
];

export const Crumb = withBreadcrumbs(routes)(({ breadcrumbs }) => {
  return (
    <div className={styles.crumb}>
      <div>您当前位置：</div>
      {breadcrumbs
        .map((breadcrumb, index, list) => {
          if (breadcrumb.props.children === 'NULL') {
            return null;
          }
          return (
            <span key={breadcrumb.key}>
              {index >= list.length - 1 ? (
                <span>{breadcrumb}</span>
              ) : (
                <NavLink to={breadcrumb.props.match.url}>{breadcrumb}</NavLink>
              )}

              {index < breadcrumbs.length - 1 && <i> >> </i>}
            </span>
          );
        })
        .filter(h => h)}
    </div>
  );
});
