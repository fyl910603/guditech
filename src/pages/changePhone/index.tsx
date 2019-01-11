import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button } from 'antd';
import { Input2 } from 'components/input';
import { MessageBox } from 'components/messageBox';
import { PicVerifycode } from 'components/picVerifycode';
import { namespace } from './model';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';

let divForm: HTMLDivElement;

const Component = ({ dispatch, data }) => {
  function check() {
    const { phone, verifycode, operationCode } = data;

    if (!phone) {
      MessageBox.show('请输入手机号', divForm);
      return false;
    }

    if (!verifycode) {
      MessageBox.show('请输入验证码', divForm);
      return false;
    }

    // 此值是在验证图片验证码成功时返回的
    if (!operationCode) {
      MessageBox.show('请获取短信验证码，并将验证码填入', divForm);
      return false;
    }

    return true;
  }

  function onPhoneChanged(e) {
    dispatch({
      type: `${namespace}/onPhoneChanged`,
      payload: e.target.value,
    });
  }

  function onVerifycodeChanged(e) {
    dispatch({
      type: `${namespace}/onVerifycodeChanged`,
      payload: e.target.value,
    });
  }

  function onSubmit(e) {
    if (!check()) {
      return;
    }

    dispatch({
      type: `${namespace}/save`,
      payload: {
        container: divForm,
      },
    });
  }

  function onOpenPicVerifycode() {
    const { phone } = data;
    if (!phone) {
      MessageBox.show('请输入手机号', divForm);
      return;
    }

    dispatch({
      type: `${namespace}/openPicVerifycode`,
      payload: {
        codetype: 3,
        phone,
        container: divForm,
      },
    });
  }

  function onClosePicVerifycode() {
    dispatch({
      type: `${namespace}/closePicverifycode`,
      payload: {},
    });
  }

  function onPicVerifycodeError(msg: string) {
    MessageBox.show(msg, divForm);
  }

  function onSendVerifycodeSuccess(code) {
    dispatch({
      type: `${namespace}/getVerifycodeSuccess`,
      payload: {
        code,
      },
    });
    dispatch({
      type: `${namespace}/beginWait`,
      payload: {},
    });

    MessageBox.show(`短信已发送至号码为${data.phone}的手机，请注意查收。`, divForm);
  }

  return (
    <div className={styles.page} ref={obj => (divForm = obj)}>
      <div className={styles.form}>
        <Form>
          <FormItem title="手机号：">
            <Input2 placeholder="请输入未注册手机号" value={data.phone} onChange={onPhoneChanged} />
          </FormItem>
          <FormItem title="验证码：">
            <Input2
              placeholder="请输入短信验证码"
              value={data.verifycode}
              onChange={onVerifycodeChanged}
            />
            <Button
              type="primary"
              ghost
              className={styles.btnVerifycode}
              onClick={onOpenPicVerifycode}
              disabled={data.waitSeconds > 0}
            >
              {data.waitSeconds > 0 ? `${data.waitSeconds}秒后重发` : '获取验证码'}
            </Button>
          </FormItem>
          <FormItem colspan={true}>
            <div className={styles.divBtn}>
              <Button type="primary" onClick={onSubmit}>
                确定
              </Button>
            </div>
          </FormItem>
        </Form>
      </div>

      {data.isShowPicVerifycode && (
        <PicVerifycode
          codetype={3}
          phone={data.phone}
          pic={data.pic}
          onSuccess={onSendVerifycodeSuccess}
          onClose={onClosePicVerifycode}
          onError={onPicVerifycodeError}
          position="center"
        />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    data: state[namespace],
  };
};

export default connect(mapStateToProps)(Component);
