import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button, Modal } from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { PictureShow } from 'components/pictureShow';
import { PictureUpload } from 'components/pictureUpload';
import { namespace } from './model';
import { LinkButton } from 'components/linkButton';
import { MessageBox } from 'components/messageBox';

let divForm: HTMLDivElement;

const Component = ({ dispatch, data }) => {
  function onSubmit(e) {
    e.preventDefault();

    dispatch({
      type: `${namespace}/save`,
      payload: {
        container: divForm,
      },
    });
  }

  function onSignnameChanged(e) {
    dispatch({
      type: `${namespace}/signnameChanged`,
      payload: e.target.value,
    });
  }
  function picUpload(data) {
    dispatch({
      type: `${namespace}/picUpload`,
      payload: data,
    });
  }

  function onPicUploadError(error) {
    MessageBox.show(error, divForm);
  }

  const { lastData, currData, isShowLastInfo } = data;

  const canSave = currData.Status === undefined || currData.Status === 1 || currData.Status === 4;

  function onOpenLastInfo() {
    dispatch({
      type: `${namespace}/showLastInfo`,
      payload: true,
    });
  }
  function onCloseLastInfo() {
    dispatch({
      type: `${namespace}/showLastInfo`,
      payload: false,
    });
  }

  const statusList = {
    1: '您好，您提交的资料正在等待审核中请您耐心的等待下，1-3个工作日会反馈审核结果',
    2: '您好，您提交的资料正在审核中请您耐心的等待下，1-3个工作日会反馈审核结果',
    3: '您好，您提交的资料已审核通过',
    4: '您好，您提交的资料已审核失败',
    5: '您好，您提交的资料已被管理员作废',
  };

  let backgroundColor = '';
  switch (currData.Status) {
    case 4: // 失败
      backgroundColor = '#9e2f26';
      break;
    case 3: // 通过
      backgroundColor = '#407733';
      break;
    default:
      backgroundColor = '#ffffff';
      break;
  }

  return (
    <div className={styles.page} ref={obj => (divForm = obj)}>
      <div className={styles.status} style={{ backgroundColor }}>
        <span>{statusList[currData.Status]}</span>
        {lastData && (
          <LinkButton type="primary" className={styles.btnLink} onClick={onOpenLastInfo}>
            查看原有资料
          </LinkButton>
        )}
      </div>
      <div className={styles.form}>
        <Form>
          <FormItem title="签名：" thWidth={120}>
            <Input2
              onChange={onSignnameChanged}
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
            <Button type="primary" onClick={onSubmit} disabled={!canSave}>
              保存
            </Button>
          </FormItem>
        </Form>
      </div>

      {lastData && (
        <Modal
          title="查看原有资料"
          visible={isShowLastInfo}
          onOk={onCloseLastInfo}
          okText="确认"
          className={styles.modalLast}
          closable={false}
        >
          <Form>
            <FormItem title="签名">
              <Input2 value={lastData.SignName} disabled={true} />
            </FormItem>
            <FormItem title="营业执照">
              <PictureShow type={2} url={lastData.LicenceUrl} />
            </FormItem>
          </Form>
        </Modal>
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
