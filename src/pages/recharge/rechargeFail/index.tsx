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
    const { StatusRemark } = this.props.data;
    return (
      <div className={styles.page}>
        <div className={styles.form}>
          <div className={styles.line1} />
          <div className={styles.line2}>充值失败</div>
          <div className={styles.line3}>{StatusRemark}</div>
          <div className={styles.line5}>
            <Button type="primary" onClick={this.onBackIndex}>
              确定
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
