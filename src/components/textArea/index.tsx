import * as React from 'react';
import Input, { TextAreaProps } from 'antd/es/input';
import styles from './styles.less';

export interface Props extends TextAreaProps {
  showFontCount?: boolean;
  value: string;
}

export class TextArea2 extends React.Component<Props, any> {
  render() {
    let { autoComplete = 'off', showFontCount,rows,...other } = this.props;
    let props = {
      ...other,
      rows,
      autoComplete,
    };
    console.log(this.props)
    const { value = '', maxLength } = this.props;

    return (
      <div className={styles.div}>
        <Input.TextArea {...props} />
        {showFontCount && <div className={styles.fontCount}>{`${value.length}/${maxLength}`}</div>}
      </div>
    );
  }
}
