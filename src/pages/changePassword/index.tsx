import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button } from 'antd';
import { Input2 } from 'components/input';
import { MessageBox } from 'components/messageBox';
import { passwordReg } from 'utils/reg';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { namespace } from './model';

let divForm: HTMLDivElement;

const Component = ({ dispatch, data }) => {
  function check() {
    const { oldpassword, newpassword, newpassword2 } = data;

    if (!oldpassword) {
      MessageBox.show('请输入密码', divForm);
      return false;
    }
    if (!passwordReg.test(newpassword)) {
      MessageBox.show('新密码格式不正确，请重新输入', divForm);
      return false;
    }
    if (!newpassword2) {
      MessageBox.show('请输入确认密码', divForm);
      return false;
    }
    if (newpassword !== newpassword2) {
      MessageBox.show('两次输入的密码不一致，请重新输入', divForm);
      return false;
    }

    return true;
  }

  function onOldPasswordChanged(e) {
    dispatch({
      type: `${namespace}/onOldPasswordChanged`,
      payload: e.target.value,
    });
  }

  function onNewPasswordChanged(e) {
    dispatch({
      type: `${namespace}/onNewPasswordChanged`,
      payload: e.target.value,
    });
  }

  function onNewPassword2Changed(e) {
    dispatch({
      type: `${namespace}/onNewPassword2Changed`,
      payload: e.target.value,
    });
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!check()) {
      return;
    }

    dispatch({
      type: 'changePassword/change',
      payload: {
        container: divForm,
      },
    });
  }

  return (
    <div className={styles.page} ref={obj => (divForm = obj)}>
      <div className={styles.form}>
        <Form>
          <FormItem title="旧密码：" thWidth={120}>
            <Input2
              type="password"
              placeholder="新输入原始密码"
              value={data.oldpassword}
              onChange={onOldPasswordChanged}
            />
          </FormItem>
          <FormItem title="新密码：">
            <Input2
              type="password"
              placeholder="6~20字符，英文、数字或符号组成"
              value={data.newpassword}
              onChange={onNewPasswordChanged}
            />
          </FormItem>
          <FormItem title="确认新密码：">
            <Input2
              type="password"
              placeholder="确认新密码"
              value={data.newpassword2}
              onChange={onNewPassword2Changed}
            />
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
    </div>
  );
};

const mapStateToProps = state => {
  return {
    data: state[namespace],
  };
};

export default connect(mapStateToProps)(Component);
