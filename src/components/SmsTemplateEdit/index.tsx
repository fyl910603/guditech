import * as React from 'react';
import styles from './styles.less';
import { Modal } from 'antd';
import { Button} from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { TextArea2 } from 'components/textArea';
import { MessageBox } from 'components/messageBox';
import { PictureShow } from 'components/pictureShow';
import { PictureUpload } from 'components/pictureUpload';
// import { namespace } from './model';
export interface Props {
  onSave?: (data: any, div: HTMLDivElement) => void;
  dispatch: (props: any) => void;
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
let divForm: HTMLDivElement;
export class SmsTemplateEdit extends React.PureComponent<Props, State> {
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
  onSignnameChanged = (e) =>{
        // dispatch({
        //   type: `${namespace}/signnameChanged`,
        //   payload: e.target.value,
        // });
      }
  picUpload = (data) =>{
    // dispatch({
    //   type: `${namespace}/picUpload`,
    //   payload: data,
    // });
  }

  onPicUploadError = (error)=>{
    MessageBox.show(error, divForm);
  }
  render() {
    const { templatename, templatcontent, templatlink, createTime, examinedTime } = this.state;
    const { currData,  isShowEdit } = this.props.data;
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
            <FormItem title="签名：" thWidth={120}>
            <Input2
                onChange={this.onSignnameChanged}
                value={currData.SignName}
                maxLength={12}
                placeholder="请输入签名信息"
              />
            </FormItem>
            <FormItem title="营业执照：">
              <div className={styles.picItem}>
                <PictureShow type={2} url={currData.LicenceUrl} />
                <PictureUpload
                  onSuccess={picUpload}
                  onError={onPicUploadError}
                  type={2}
                  title="上传营业执照"
                />
              </div>
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.onSubmit} disabled={!canSave}>
                保存
              </Button>
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