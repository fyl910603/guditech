import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Card, Button } from 'antd';
import { Input2 } from 'components/input';
import { LinkButton } from 'components/linkButton';
import { PicVerifycode } from 'components/picVerifycode';
import { MessageBox } from 'components/messageBox';
import router from 'umi/router';
import { passwordReg } from 'utils/reg';
import { namespace } from './model';
import { Footer, FooterSpace } from 'components/footer';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';

let divForm: HTMLDivElement;

const Component = ({ dispatch, data }) => {
  function onUsernameChanged(e) {
    dispatch({
      type: `${namespace}/onUsernameChanged`,
      payload: e.target.value,
    });
  }

  function onVerifycodeChanged(e) {
    dispatch({
      type: `${namespace}/onVerifycodeChanged`,
      payload: e.target.value,
    });
  }
  function onPasswordChanged(e) {
    dispatch({
      type: `${namespace}/onPasswordChanged`,
      payload: e.target.value,
    });
  }
  function onPassword2Changed(e) {
    dispatch({
      type: `${namespace}/onPassword2Changed`,
      payload: e.target.value,
    });
  }

  function check() {
    const { username, verifycode, password, password2 } = data;

    if (!username) {
      MessageBox.show('请输入手机号', divForm);
      return false;
    }
    if (!verifycode) {
      MessageBox.show('请输入验证码', divForm);
      return false;
    }
    if (!password) {
      MessageBox.show('请输入密码', divForm);
      return false;
    }
    if (!passwordReg.test(password)) {
      MessageBox.show('密码格式不正确，请重新输入', divForm);
      return false;
    }
    if (!password2) {
      MessageBox.show('请输入确认密码', divForm);
      return false;
    }
    if (password !== password2) {
      MessageBox.show('两次输入的密码不一致，请重新输入', divForm);
      return false;
    }
    // 此值是在验证图片验证码成功时返回的
    if (!data.operationCode) {
      MessageBox.show('请获取短信验证码，并将验证码填入', divForm);
      return false;
    }

    return true;
  }

  function onSubmit(e) {
    if (!check()) {
      return;
    }

    dispatch({
      type: `${namespace}/register`,
      payload: {
        container: divForm,
      },
    });
  }
  function onOpenPicVerifycode() {
    const { username } = data;

    if (!username) {
      MessageBox.show('请输入手机号', divForm);
      return;
    }

    dispatch({
      type: `${namespace}/openPicVerifycode`,
      payload: {
        codetype: 1,
        phone: username,
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
    const username = data.username;
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

    MessageBox.show(`短信已发送至号码为${username}的手机，请注意查收。`, divForm);
  }

  function onToLogin() {
    router.push('/login');
  }

  const title = (
    <div className={styles.title}>
      <div className={styles.titleLogo} />
      注册
    </div>
  );
  return (
    <div className={styles.main}>
      <div className={styles.back} />
      <Card title={title} className={styles.form}>
        <div ref={obj => (divForm = obj)}>
          <Form>
            <FormItem title="手机号">
              <Input2
                placeholder="请输入未注册手机号"
                value={data.username}
                onChange={onUsernameChanged}
                maxLength={11}
              />
            </FormItem>
            <FormItem title="验证码">
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
            <FormItem title="密码">
              <Input2
                type="password"
                placeholder="6~20字符，英文、数字或符号组成"
                value={data.password}
                onChange={onPasswordChanged}
              />
            </FormItem>
            <FormItem title="确认密码">
              <Input2
                type="password"
                placeholder="确认设置密码"
                value={data.password2}
                onChange={onPassword2Changed}
              />
            </FormItem>
            <FormItem colspan={true}>
              <Button type="primary" className={styles.btn} onClick={onSubmit}>
                注册
              </Button>
            </FormItem>
            <FormItem colspan={true}>
              <div className={styles.divBtnToLogin}>
                <LinkButton type="primary" className={styles.btnLink} onClick={onToLogin}>
                  返回登录
                </LinkButton>
              </div>
            </FormItem>
          </Form>
        </div>
      </Card>
      {data.isShowPicVerifycode && (
        <PicVerifycode
          codetype={1}
          phone={data.username}
          pic={data.pic}
          onSuccess={onSendVerifycodeSuccess}
          onClose={onClosePicVerifycode}
          onError={onPicVerifycodeError}
          position="right"
        />
      )}
      <Footer />
      <FooterSpace />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    data: state[namespace],
  };
};

export default connect(mapStateToProps)(Component);
