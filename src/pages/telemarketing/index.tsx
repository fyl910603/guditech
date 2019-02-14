import * as React from 'react';
import styles from './styles.less';
import { namespace } from './model';
import { connect } from 'dva';

class Component extends React.PureComponent {
  render() {
    return <div className={styles.page} />;
  }
}

const mapStateToProps = state => {
  return {
    data: state[namespace],
  };
};

export default connect(mapStateToProps)(Component);
