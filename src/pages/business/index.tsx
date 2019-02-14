import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button, Input, Select } from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { namespace } from './model';
import { PictureShow } from 'components/pictureShow';
import { PictureUpload } from 'components/pictureUpload';
import { AddressPick } from 'components/addressPick';
import { MessageBox } from 'components/messageBox';

let divForm: HTMLDivElement;
const Component = ({ dispatch, data }) => {
  function check() {
    const { imgUrl, nickname, summary, addressInfo } = data;
    if (!imgUrl) {
      MessageBox.show('请上传商户logo', divForm);
      return false;
    }
    if (!nickname) {
      MessageBox.show('请输入公司名称', divForm);
      return false;
    }
    if (!summary) {
      MessageBox.show('请输入公司简价', divForm);
      return false;
    }
    if (!addressInfo || !addressInfo.address) {
      MessageBox.show('请输入公司地址', divForm);
      return false;
    }
    if (!addressInfo || !addressInfo.longitude) {
      MessageBox.show('请在地图上选点', divForm);
      return false;
    }

    return true;
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

  function onNickNameChanged(e) {
    dispatch({
      type: `${namespace}/onNickNameChanged`,
      payload: e.target.value,
    });
  }
  function onSummaryChanged(e) {
    dispatch({
      type: `${namespace}/onSummaryChanged`,
      payload: e.target.value,
    });
  }
  function onPicUpload(data) {
    dispatch({
      type: `${namespace}/onPicUpload`,
      payload: data,
    });
  }
  function onPicUploadError(error) {
    MessageBox.show(error, divForm);
  }
  function onOpenMap() {
    dispatch({
      type: `${namespace}/onOpenMap`,
      payload: true,
    });
  }
  function onCloseMap() {
    dispatch({
      type: `${namespace}/onOpenMap`,
      payload: false,
    });
  }
  function onMapSelected(result) {
    dispatch({
      type: `${namespace}/onMapSelected`,
      payload: result,
    });
  }
  function onAddressChanged(value) {
    dispatch({
      type: `${namespace}/onAddressChanged`,
      payload: JSON.parse(value),
    });
  }

  function onSearchAddress(value) {
    dispatch({
      type: `${namespace}/onSearchAddress`,
      payload: value,
    });
  }

  function onHouseNumberChanged(e) {
    dispatch({
      type: `${namespace}/onHouseNumberChanged`,
      payload: e.target.value,
    });
  }

  const { addressList } = data;
  return (
    <div className={styles.page} ref={obj => (divForm = obj)}>
      <div className={styles.form}>
        <Form>
          <FormItem title="商户logo：" thWidth={100}>
            <div className={styles.picItem}>
              <PictureShow url={data.imgUrl} type={1} />
              <PictureUpload
                onSuccess={onPicUpload}
                onError={onPicUploadError}
                type={1}
                title="上传图片"
              />
            </div>
          </FormItem>
          <FormItem title="公司名称：">
            <Input2 onChange={onNickNameChanged} value={data.nickname} />
          </FormItem>
          <FormItem title="公司简价：">
            <Input.TextArea
              onChange={onSummaryChanged}
              value={data.summary}
              autosize={{ minRows: 5, maxRows: 5 }}
              placeholder="请输入您的公司简介"
            />
          </FormItem>
          <FormItem title="地址：">
            <div className={styles.divAddress}>
                <Select
                  showSearch
                  value={data.addressInfo.addressDetails}
                  placeholder="详细地址"
                  style={{ width: '400px' }}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={onSearchAddress}
                  onChange={onAddressChanged}
                  notFoundContent={null}
                >
                  {addressList.map((d, i) => {
                    const text = d.Province + d.City + d.Area + d.Address;
                    const json = {
                      address: d.Address,
                      province: d.Province,
                      city: d.City,
                      area: d.Area,
                      longitude: d.Longitude,
                      latitude: d.Latitude,
                      addressDetails: text,
                    };
                    return (
                      <Select.Option key={i} value={JSON.stringify(json)}>
                        {text}
                      </Select.Option>
                    );
                  })}
                </Select>
              <Button type="primary" ghost className={styles.btnOpenMap} onClick={onOpenMap}>
                选择地址
              </Button>
            </div>
          </FormItem>
          <FormItem title="门牌号：">
            <Input2 onChange={onHouseNumberChanged} value={data.addressInfo.houseNumber} />
          </FormItem>
          <FormItem title="">
            <Button type="primary" onClick={onSubmit}>
              保存
            </Button>
          </FormItem>
        </Form>
      </div>

      {data.isMapOpen && (
        <AddressPick onOk={onMapSelected} data={data.addressInfo} onClose={onCloseMap} />
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
