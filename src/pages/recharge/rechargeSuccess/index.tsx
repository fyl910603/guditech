import * as React from 'react';
import { namespace } from './model';
import { connect } from 'dva';
import styles from './styles.less';
import Button from 'antd/es/button';
import router from 'umi/router';

interface Props {
  data: any;
}

class Component extends React.PureComponent<Props> {
  onBackIndex = () => {
    router.push('/');
  };
  onToLog = () => {
    router.push('/recharge/rechargelog');
  };
  render() {
    const { OrderSN, PayAmount } = this.props.data;
    return (
      <div className={styles.page}>
        <div className={styles.form}>
          <div className={styles.line1} />
          <div className={styles.line2}>充值成功</div>
          <div className={styles.line3}>订单号：{OrderSN}</div>
          <div className={styles.line4}>金&nbsp;&nbsp;额：{(PayAmount / 100).toFixed(2)}元</div>
          <div className={styles.line5}>
            <Button onClick={this.onToLog}>查看订单</Button>
            <Button type="primary" onClick={this.onBackIndex}>
              返回首页
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state[namespace],
  };
};

export default connect(mapStateToProps)(Component);
