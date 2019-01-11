import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button } from 'antd';
import { Input2 } from 'components/input';
import { MessageBox } from 'components/messageBox';
import { nikeNameReg } from 'utils/reg';
import { PictureShow } from 'components/pictureShow';
import { PictureUpload } from 'components/pictureUpload';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { namespace } from './model';

let divForm: HTMLDivElement;

const Component = ({ dispatch, data }) => {
  function check() {
    if (!data.nickname) {
      MessageBox.show('请输入昵称', divForm);
      return false;
    }

    if (!nikeNameReg.test(data.nickname)) {
      MessageBox.show('昵称格式不正确，请重新输入', divForm);
      return false;
    }

    if (!data.imgUrl) {
      MessageBox.show('请上传头像', divForm);
      return false;
    }

    return true;
  }

  function onNickNameChanged(e) {
    dispatch({
      type: `${namespace}/nickNameChanged`,
      payload: e.target.value,
    });
  }

  function onPicUpload(data) {
    dispatch({
      type: `${namespace}/picUpload`,
      payload: data,
    });
  }
  function onPicUploadError(error) {
    MessageBox.show(error, divForm);
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!check()) {
      return;
    }

    dispatch({
      type: `${namespace}/save`,
      payload: {
        data: {
          nickname: data.nickname,
          imgpath: data.imgpath,
          imgUrl: data.imgUrl,
        },
        container: divForm,
      },
    });
  }

  return (
    <div className={styles.page} ref={obj => (divForm = obj)}>
      <div className={styles.form}>
        <Form>
          <FormItem title="设置头像">
            <div className={styles.picItem}>
              <PictureShow url={data.imgUrl} type={1} />
              <PictureUpload
                onSuccess={onPicUpload}
                onError={onPicUploadError}
                type={1}
                title="上传头像"
              />
            </div>
          </FormItem>
          <FormItem title="设置昵称" explain="4~25个字符，中英文数字或符号组成">
            <Input2
              placeholder="4~25个字符，中英文数字或符号组成"
              maxLength={25}
              value={data.nickname}
              onChange={onNickNameChanged}
            />
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={onSubmit}>
              保存
            </Button>
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
