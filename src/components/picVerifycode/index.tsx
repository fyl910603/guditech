import * as React from 'react';
import styles from './styles.less';
import { Card } from 'antd';
import { Button, Icon, Spin } from 'antd';
import { Input2 } from 'components/input';
import { ask, Res } from 'utils/ask';
import { LinkButton } from 'components/linkButton';
import { MessageBox } from 'components/messageBox';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import black from '../../assets/black.png';

export interface Props {
  codetype: number; // 1：注册码 2：忘记密码找回码 3:修改手机号码
  phone: string;
  pic: string;
  onSuccess: (code) => void;
  onClose: () => void;
  onError: (msg: string) => void;
  position: 'center' | 'right';
}

interface State {
  pic: string;
  picverifycode: string;
  picLoading: boolean;
}

export class PicVerifycode extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      pic: '',
      picverifycode: '',
      picLoading: true,
    };
  }

  onPicverifycodeChanged = e => {
    this.setState({
      picverifycode: e.target.value,
    });
  };

  async getPicCode() {
    const { phone, codetype, onError } = this.props;
    const res: Res = await ask({
      url: '/api/user/picverifycode',
      body: {
        phone,
        codetype,
      },
      method: 'GET',
    });

    if (res.success) {
      this.setState({
        pic: res.data + `?${new Date().getTime()}`,
      });
    } else {
      onError(res.message);
      this.onClose();
    }
  }

  async componentDidMount() {
    this.setState({
      pic: this.props.pic + `?${new Date().getTime()}`,
    });
  }

  onChangeCode = () => {
    this.setState(
      {
        picLoading: true,
      },
      () => {
        this.getPicCode()
          .then()
          .catch();
      }
    );
  };

  onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  async getVerifycode() {
    const { phone, codetype } = this.props;
    const picverifycode = this.state.picverifycode;
    if (!picverifycode) {
      MessageBox.show('请输入图片验证码', this.divForm);
      throw new Error();
    }
    const res: Res = await ask({
      url: '/api/user/sendverifycode',
      body: {
        codetype,
        picverifycode,
        phone,
      },
    });
    if (res.success) {
      return res.data; // 保存从获取短信验证码返回的操作码，注册时要用到
    } else {
      MessageBox.show(res.message, this.divForm);
      throw new Error(res.message);
    }
  }

  onPicLoaded = () => {
    this.setState({
      picLoading: false,
    });
  };

  onSubmit = e => {
    this.getVerifycode()
      .then(code => {
        const { onSuccess } = this.props;
        if (onSuccess) {
          onSuccess(code);
        }
      })
      .catch(() => {});
  };

  render() {
    const { pic, picverifycode, picLoading } = this.state;
    const { position } = this.props;

    return (
      <div className={`${styles.cover} ${position === 'center' ? styles.center : ''}`}>
        <Card
          title="图片验证码"
          className={styles.form}
          extra={
            <Icon type="close" theme="outlined" className={styles.close} onClick={this.onClose} />
          }
        >
          <div ref={obj => (this.divForm = obj)}>
            <Form>
              <FormItem title="验证码">
                <Input2
                  placeholder="请输入验证码"
                  value={picverifycode}
                  onChange={this.onPicverifycodeChanged}
                />

                <div className={styles.divPic}>
                  <Spin size="default" spinning={picLoading}>
                    <img src={pic || black} className={styles.pic} onLoad={this.onPicLoaded} />
                  </Spin>
                </div>
              </FormItem>
              <FormItem colspan={true}>
                <div className={styles.divChange}>
                  <span>验证码不分大小写</span>
                  <span>
                    看不清?
                    <LinkButton
                      type="primary"
                      ghost
                      className={styles.btnLink}
                      onClick={this.onChangeCode}
                    >
                      换一张
                    </LinkButton>
                  </span>
                </div>
              </FormItem>
              <FormItem colspan={true}>
                <div className={styles.divBtn}>
                  <Button type="primary" className={styles.btn} onClick={this.onSubmit}>
                    确认
                  </Button>
                </div>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}
