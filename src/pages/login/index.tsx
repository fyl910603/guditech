import * as React from 'react';
import { connect } from 'dva';
import { Card, Button, Checkbox } from 'antd';
import { Input2 } from 'components/input';
import { LinkButton } from 'components/linkButton';
import styles from './styles.less';
import router from 'umi/router';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { namespace } from './model';
import { Footer, FooterSpace } from 'components/footer';
import { MessageBox } from 'components/messageBox';

let divForm: HTMLDivElement;
const Component = ({ dispatch, data }) => {
  function check() {
    const { username, verifycode, password, password2 } = data;

    if (!username) {
      MessageBox.show('请输入手机号', divForm);
      return false;
    }

    if (!password) {
      MessageBox.show('请输入密码', divForm);
      return false;
    }

    return true;
  }

  function onLogin(e) {
    if (!check()) {
      return;
    }
    dispatch({
      type: `${namespace}/login`,
      payload: {
        container: divForm,
      },
    });
  }

  function onUsernameChanged(e) {
    dispatch({
      type: `${namespace}/onUsernameChanged`,
      payload: e.target.value,
    });
  }

  function onPasswordChanged(e) {
    dispatch({
      type: `${namespace}/onPasswordChanged`,
      payload: e.target.value,
    });
  }

  function onIsStoreChanged() {
    dispatch({
      type: `${namespace}/isStoreChanged`,
      payload: {
        isStore: !data.isStore,
      },
    });
  }

  function onToForget() {
    router.push('/forget');
  }

  function onToRegister() {
    router.push('/register');
  }

  const title = (
    <div className={styles.title}>
      <div className={styles.titleLogo} />
      古迪营销推广平台
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
                placeholder="请输入手机号"
                value={data.username}
                onChange={onUsernameChanged}
                maxLength={11}
              />
            </FormItem>
            <FormItem title="密码">
              <Input2
                type="password"
                placeholder="请输入密码"
                value={data.password}
                onChange={onPasswordChanged}
              />
            </FormItem>
            <FormItem colspan={true}>
              <Button type="primary" className={styles.btn} onClick={onLogin}>
                登录
              </Button>
            </FormItem>
            <FormItem colspan={true}>
              <div className={styles.divBtnOption}>
                <Checkbox checked={data.isStore} onChange={onIsStoreChanged}>
                  记住用户名
                </Checkbox>
                <LinkButton type="default" className={styles.btnForget} onClick={onToForget}>
                  忘记密码？
                </LinkButton>
                <LinkButton type="primary" className={styles.btnLink} onClick={onToRegister}>
                  新用户注册
                </LinkButton>
              </div>
            </FormItem>
          </Form>
        </div>
      </Card>

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
