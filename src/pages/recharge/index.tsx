import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button } from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { namespace } from './model';
import { MessageBox } from 'components/messageBox';
import router from 'umi/router';

interface Props {
  dispatch: any;
  data: any;
}

class Component extends React.PureComponent<Props> {
  private divForm: HTMLDivElement;
  private iframe: HTMLIFrameElement;

  check = () => {
    const { rechargeid, paytype } = this.props.data;

    if (!rechargeid) {
      MessageBox.show('请选择充值金额', this.divForm);
      return false;
    }
    if (!paytype) {
      MessageBox.show('请选择支付方式', this.divForm);
      return false;
    }

    return true;
  };

  onNameChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onNameChanged`,
      payload: e.target.value,
    });
  };
  onSelectRItem = id => {
    this.props.dispatch({
      type: `${namespace}/onSelectRItem`,
      payload: id,
    });
  };
  onSelectPaytype = code => {
    this.props.dispatch({
      type: `${namespace}/onSelectPaytype`,
      payload: code,
    });
  };
  onSubmit = e => {
    if (!this.check()) {
      return;
    }
    this.props.dispatch({
      type: `${namespace}/save`,
      payload: {
        data: {
          nickname: this.props.data.nickname,
        },
        container: this.divForm,
      },
    });
  };

  onOpenLog = e => {
    router.push('/recharge/rechargelog?clear=1');
  };

  render() {
    const {
      paymentTypeList = [],
      rechargeList = [],
      UserName,
      rechargeid,
      paytype,
    } = this.props.data;

    return (
      <div className={styles.page} ref={obj => (this.divForm = obj)}>
        <Button className={styles.btnLog} ghost type="primary" onClick={this.onOpenLog}>
          充值记录
        </Button>
        <div className={styles.form}>
          <Form>
            <FormItem title="充值账户：" thWidth={130}>
              <Input2 onChange={this.onNameChanged} value={UserName} maxLength={11} />
            </FormItem>
            <FormItem title="充值金额：">
              <div className={styles.rList}>
                {rechargeList.map(h => (
                  <div className={styles.rItem} key={h.GoodsId}>
                    <div
                      className={`${styles.border} ${
                        h.GoodsId === rechargeid ? styles.selected : ''
                      }`}
                      onClick={() => this.onSelectRItem(h.GoodsId)}
                    >
                      <div className={styles.money}>
                        <p className={styles.goodsName}>{h.GoodsName}</p>
                        <p className={`${h.FreeDes != ''?styles.integral: styles.none}`}>{h.FreeDes}</p>
                      </div>
                      
                    </div>
                    <div className={styles.price}>{h.ShowPrice}</div>
                  </div>
                ))}
              </div>
            </FormItem>
            <FormItem title="支付方式：">
              <div className={styles.paytypelist}>
                {paymentTypeList.map(h => (
                  <div key={h.TypeCode} className={styles[h.TypeCode]}>
                    <div
                      className={`${styles.btnPaytype}  ${
                        h.TypeCode === paytype ? styles.selected : ''
                      }`}
                      onClick={() => this.onSelectPaytype(h.TypeCode)}
                    >
                      {h.Name}
                    </div>
                  </div>
                ))}
              </div>
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.onSubmit}>
                充值
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state[namespace],
  };
};

export default connect(mapStateToProps)(Component);
