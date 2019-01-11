import * as React from 'react';
import styles from './styles.less';
import { Modal } from 'antd';
import { Button } from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { TextArea2 } from 'components/textArea';

export interface Props {
  onClose: () => void;
  data: any;
}

export class ShortMessageCheck extends React.PureComponent<Props> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    const { data } = this.props;
  }

  onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  render() {
    const { data = {} } = this.props;
    return (
      <div className={styles.main}>
        <Modal
          title={'验证信息'}
          visible={true}
          className={styles.modal}
          onCancel={this.onClose}
          centered={true}
        >
          <div ref={obj => (this.divForm = obj)} className={styles.divContent}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>手机号码</th>
                  <th>孩子姓名</th>
                  <th>性别</th>
                  <th>生日</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.Mobile}</td>
                  <td>{data.Name}</td>
                  <td>{data.Sex === 1 ? '男' : '女'}</td>
                  <td>{data.Birthday}</td>
                </tr>
              </tbody>
            </table>
            <div className={styles.divBtn}>
              <Button type="primary" onClick={this.onClose}>
                关闭
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
