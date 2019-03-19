import * as React from 'react';
import styles from './styles.less';
import { Modal,Select,DatePicker } from 'antd';
import moment from 'moment';
import { Button } from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { TextArea2 } from 'components/textArea';

export interface Props {
  onSave?: (data: any, div: HTMLDivElement) => void;
  onClose: () => void;
  isEdit: boolean;
  data: any;
}
const dateFormat = 'YYYY-MM-DD HH:mm:ss'
interface State {
  Name: string;
  Description: string;
  Id: any;
  DelegateCount: string;
  StartTime: string;
  EndTime: string;
}

export class DelegateTemplateEdit extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      Name: '',
      Description: '',
      DelegateCount:'',
      StartTime:'',
      EndTime: '',
      Id: ''
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

  onTemplatenameChanged = e => {
    this.setState({
      Name: e.target.value,
    });
  };
  onDateChanged = e => {
    this.setState({
      StartTime: e[0].format('YYYY-MM-DD 00:00:00'),
      EndTime:e[1].format('YYYY-MM-DD 23:59:59')
    });
  };
  onTemplatcontentChanged = e => {
    this.setState({
      Description: e.target.value,
    });
  };

  onTemplatlinkChanged = e => {
    this.setState({
      DelegateCount: e.target.value,
    });
  };
  handleChange = value =>{
    this.setState({
      Id: value,
    });
  }
  onSubmit = e => {
    const { onSave } = this.props;
    if (onSave) {
      onSave(this.state, this.divForm);
    }
  };

  render() {
    const { Name, Description, DelegateCount, StartTime, EndTime, Id } = this.state;
    const { isEdit,data} = this.props;
    let title = '添加活动';
    if (data) {
      title = '修改活动';
    }
    if (!isEdit) {
      title = '模版详情';
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
              {isEdit ? (
                <Button type="primary" className={styles.btn} onClick={this.onSubmit}>
                  提交审核
                </Button>
              ) : (
                <Button type="primary" className={styles.btn} onClick={this.onClose}>
                  关闭
                </Button>
              )}
            </div>
          }
        >
          <div ref={obj => (this.divForm = obj)}>
            <Form>
              <FormItem title="活动名称:" splitHeight={isEdit ? 40 : 12}>
                <Input2
                  placeholder="请输入活动名称，不超过16个字符"
                  value={Name}
                  onChange={isEdit ? this.onTemplatenameChanged : undefined}
                  maxLength={16}
                  showFontCount={isEdit}
                  disabled={!isEdit}
                />
              </FormItem>
              <FormItem title="活动时间:" splitHeight={isEdit ? 40 : 12}>
                <DatePicker.RangePicker onChange={this.onDateChanged} format={dateFormat} defaultValue={[moment(data.StartTime, dateFormat), moment(data.EndTime, dateFormat)]}/>
              </FormItem>
              <FormItem title="委托数量:" splitHeight={isEdit ? 40 : 12}>
                <Input2
                  placeholder="请输入委托数量"
                  value={DelegateCount}
                  onChange={isEdit ? this.onTemplatlinkChanged : undefined}
                  maxLength={10}
                  showFontCount={isEdit}
                  disabled={!isEdit}
                />
              </FormItem>
              <FormItem title="活动内容:" splitHeight={isEdit ? 40 : 12}>
                <TextArea2
                  placeholder="请输入活动内容"
                  value={Description}
                  onChange={isEdit ? this.onTemplatcontentChanged : undefined}
                  maxLength={128}
                  showFontCount={isEdit}
                  className={styles.textarea}
                  disabled={!isEdit}
                />
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}
