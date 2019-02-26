import * as React from 'react';
import styles from './styles.less';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import NavLink from 'umi/navlink';
import router from 'umi/router';

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
  { path: '/help', breadcrumb: '帮助中心' },
  { path: '/help/faq', breadcrumb: ()=> getName()},
  { path: '/help/faq/:id', breadcrumb: ()=> getQuery('Qname')},
  { path: '/help/:id', breadcrumb: ()=> getQuery('Cname') },
  { path: '/balanceChangeList', breadcrumb: '余额变更记录' },
  { path: '/phone', breadcrumb: '电话业务' },
  { path: '/business', breadcrumb: '商户中心' },
  { path: '/customer', breadcrumb: '客户管理' },
  { path: '/sinks', breadcrumb: '短信业务' },
  { path: '/telemarketing', breadcrumb: 'NULL' },
  { path: '/telemarketing/teleListForCall', breadcrumb: '电话营销' },
  { path: '/telemarketing/teleListForCall/phoneDetail', breadcrumb: '电话记录' },
  { path: '/telemarketing/teleListForCall/callRecord', breadcrumb: '拨打记录' },
  { path: '/telemarketing/smsTemplate', breadcrumb: '短信模板' },
  { path: '/commissionMarket', breadcrumb: '委托营销' }
];
function getName(){
  return getQuery('name') != undefined ? getQuery('name'):'常见问题'
}
function getQuery(name){
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
    let r = decodeURI(window.location.search).substr(1).match(reg);
    let q = decodeURI(window.location.pathname).substr(1).match(reg_rewrite);
    if(r != null) {
        return unescape(r[2]);
    } else if(q != null) {
        return unescape(q[2]);
    } else {
        return null;
    }
}
export const Crumb = withBreadcrumbs(routes)(({ breadcrumbs }) => {
  if(breadcrumbs.length >= 3){
    if(breadcrumbs[2].key == '/help/faq'){
      if(breadcrumbs[2].props.location.query.id != undefined){
        // breadcrumbs[2].props.children = breadcrumbs[2].props.location.query.name
      }
    }
  }
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
