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
  private iframe: HTMLIFrameElement;
  private qrInited: boolean;

  componentDidMount() {
    if (this.props.recharge.QRCode) {
      this.iframe.contentDocument.write(this.props.recharge.QRCode);
      this.qrInited = true;
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.data.QRCode && !this.qrInited) {
      this.iframe.contentDocument.write(nextProps.data.QRCode);
      this.qrInited = true;
    }
  }

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
          <div className={styles.line1}>请使用支付宝扫描二维码支付</div>
          <div className={styles.line2}>应付金额：¥{(recharge.totalAmount / 100).toFixed(2)}</div>
          <div className={styles.linePic}>
            <iframe
              ref={obj => (this.iframe = obj)}
              scrolling="no"
              frameBorder="0"
              className={styles.ewb}
            />
          </div>
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
