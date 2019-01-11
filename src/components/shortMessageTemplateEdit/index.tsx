import * as React from 'react';
import styles from './styles.less';
import { Modal } from 'antd';
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

interface State {
  templatename: string;
  templatcontent: string;
  templatlink: string;
  createTime: string;
  examinedTime: string;
}

export class ShortMessageTemplateEdit extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      templatename: '',
      templatcontent: '',
      templatlink: '',
      createTime: '',
      examinedTime: '',
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
      templatename: e.target.value,
    });
  };

  onTemplatcontentChanged = e => {
    this.setState({
      templatcontent: e.target.value,
    });
  };

  onTemplatlinkChanged = e => {
    this.setState({
      templatlink: e.target.value,
    });
  };

  onSubmit = e => {
    const { onSave } = this.props;
    if (onSave) {
      onSave(this.state, this.divForm);
    }
  };

  render() {
    const { templatename, templatcontent, templatlink, createTime, examinedTime } = this.state;
    const { isEdit } = this.props;

    let title = '添加短信模板';
    if (this.props.data) {
      title = '修改短信模板';
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
              <FormItem title="模板名称:" splitHeight={isEdit ? 40 : 12}>
                <Input2
                  placeholder="请输入模板名称，不超过16个字符"
                  value={templatename}
                  onChange={isEdit ? this.onTemplatenameChanged : undefined}
                  maxLength={16}
                  showFontCount={isEdit}
                  disabled={!isEdit}
                />
              </FormItem>
              <FormItem title="短信内容:" splitHeight={isEdit ? 40 : 12}>
                <TextArea2
                  placeholder="请输入短信内容文字，不超过128个字符"
                  value={templatcontent}
                  onChange={isEdit ? this.onTemplatcontentChanged : undefined}
                  maxLength={128}
                  showFontCount={isEdit}
                  className={styles.textarea}
                  disabled={!isEdit}
                />
              </FormItem>
              <FormItem title="短信链接:" splitHeight={isEdit ? 40 : 12}>
                <Input2
                  placeholder="请输入短信链接，不超过48个字符"
                  value={templatlink}
                  onChange={isEdit ? this.onTemplatlinkChanged : undefined}
                  maxLength={48}
                  showFontCount={isEdit}
                  disabled={!isEdit}
                />
              </FormItem>
              {!isEdit && (
                <React.Fragment>
                  <FormItem title="创建时间:" splitHeight={isEdit ? 40 : 12}>
                    <Input2
                      placeholder=""
                      value={createTime}
                      maxLength={48}
                      showFontCount={isEdit}
                      disabled={!isEdit}
                    />
                  </FormItem>
                  <FormItem title="通过时间:" splitHeight={isEdit ? 40 : 12}>
                    <Input2
                      placeholder=""
                      value={examinedTime}
                      maxLength={48}
                      showFontCount={isEdit}
                      disabled={!isEdit}
                    />
                  </FormItem>
                </React.Fragment>
              )}
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}
