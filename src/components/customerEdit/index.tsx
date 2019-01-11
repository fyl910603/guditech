import * as React from 'react';
import styles from './styles.less';
import { Modal } from 'antd';
import { Button } from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { TextArea2 } from 'components/textArea';
import { MessageBox } from 'components/messageBox';

export interface Props {
  onSave: (data: any, div: HTMLDivElement) => void;
  onClose: () => void;
  data: any;
}

interface State {
  ChildsName: string;
  Mobile: string;
  DetailAddress: string;
}

export class CustomerEdit extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      ChildsName: '',
      Mobile: '',
      DetailAddress: '',
    };
  }

  componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.setState(data);
    }
  }

  onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  onNameChanged = e => {
    this.setState({
      ChildsName: e.target.value,
    });
  };

  onMobileChanged = e => {
    this.setState({
      Mobile: e.target.value,
    });
  };

  onDetailAddressChanged = e => {
    this.setState({
      DetailAddress: e.target.value,
    });
  };

  check = () => {
    const { ChildsName, Mobile, DetailAddress } = this.state;
    if (!ChildsName) {
      MessageBox.show('请输入姓名', this.divForm);
      return false;
    }
    if (!Mobile) {
      MessageBox.show('请输入手机号', this.divForm);
      return false;
    }
    return true;
  };

  onSubmit = e => {
    if (!this.check()) {
      return;
    }
    const { onSave } = this.props;
    if (onSave) {
      onSave(this.state, this.divForm);
    }
  };

  render() {
    const { ChildsName, Mobile, DetailAddress } = this.state;
    let title = '添加客户信息';
    if (this.props.data) {
      title = '修改客户信息';
    }
    return (
      <div className={styles.main}>
        <Modal
          title={title}
          visible={true}
          className={styles.modal}
          onCancel={this.onClose}
          centered={true}
          footer={
            <div className="divBtn">
              <Button type="primary" className={styles.btn} onClick={this.onSubmit}>
                确认
              </Button>
            </div>
          }
        >
          <div ref={obj => (this.divForm = obj)}>
            <Form>
              <FormItem title="姓名:" isRequire={true} thWidth={105}>
                <Input2
                  placeholder="请输入客户姓名"
                  value={ChildsName}
                  onChange={this.onNameChanged}
                  // maxLength={16}
                />
              </FormItem>
              <FormItem title="手机号码:" isRequire={true}>
                <Input2
                  placeholder="请输入客户联系方式"
                  value={Mobile}
                  onChange={this.onMobileChanged}
                  // maxLength={48}
                />
              </FormItem>
              <FormItem title="详细地址:" splitHeight={1}>
                <TextArea2
                  placeholder="请输入客户详细地址"
                  value={DetailAddress}
                  onChange={this.onDetailAddressChanged}
                  // maxLength={128}
                  className={styles.textarea}
                />
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}
