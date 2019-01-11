import * as React from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';
import styles from './styles.less';

export class LinkButton extends React.PureComponent<ButtonProps> {
  render() {
    let { className } = this.props;

    return (
      <Button ghost {...this.props} className={`${className} ${styles.btn}`}>
        {this.props.children}
      </Button>
    );
  }
}
