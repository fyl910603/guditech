import * as React from 'react';
import { namespace } from './model';
import { connect } from 'dva';
import styles from './styles.less';

interface Props {
  data: any;
  recharge: any;
  dispatch: (props: any) => void;
}

class Component extends React.PureComponent<Props> {
  componentWillUnmount() {
    this.props.dispatch({
      type: `${namespace}/onClose`,
      payload: {},
    });
  }

  render() {
    const { recharge } = this.props;
    return (
      <div className={styles.page}>
        <div className={styles.form}>
          <div className={styles.line1}>请使用微信扫描二维码支付</div>
          <div className={styles.line2}>应付金额：¥{(recharge.totalAmount / 100).toFixed(2)}</div>
          <div className={styles.linePic} style={{ backgroundImage: `url(${recharge.QRCode})` }} />
          {/* <div className={styles.line4}>剩余支付时间60S，失效后请刷新页面</div> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state[namespace],
    recharge: state.recharge,
  };
};

export default connect(mapStateToProps)(Component);
