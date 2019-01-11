import * as React from 'react';
import styles from './styles.less';
import { Modal, Tree, Checkbox } from 'antd';
import { Button } from 'antd';
import moment from 'moment';

export interface Props {
  onSave?: (div: HTMLDivElement) => void;
  onClose: () => void;
  doType: 'send' | 'detail';
  data: any;
}

export class ShortMessageSendConfirm extends React.PureComponent<Props> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  onSubmit = e => {
    const { onSave } = this.props;
    if (onSave) {
      onSave(this.divForm);
    }
  };
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode {...item} />;
    });
  };

  render() {
    const { doType } = this.props;
    let title = doType === 'send' ? '短信发送确认' : '短信详情';

    const {
      search_age,
      search_sex,
      search_region,
      search_radius,
      search_userOrder,

      reply_specificAge,
      reply_birthday,
      reply_familyEconomic,
      reply_fullName,
      reply_sex,
      reply_area,
      form,
      search_address,
    } = this.props.data;

    let { sendtime = '', sendtype } = form;

    if (sendtype === '1') {
      sendtime = moment().format('YYYY-MM-DD HH:mm:ss');
    } else {
      try {
        sendtime = sendtime.format('YYYY-MM-DD HH:mm:ss');
      } catch {}
    }

    return (
      <div className={styles.main}>
        <Modal
          title={title}
          visible={true}
          className={styles.modal}
          onCancel={this.onClose}
          footer={
            doType === 'send' ? (
              <div className="divBtn">
                <Button type="primary" ghost onClick={this.onClose}>
                  取消
                </Button>
                <Button type="primary" onClick={this.onSubmit}>
                  发送
                </Button>
              </div>
            ) : (
              <div className={styles.divBtn}>
                <Button type="primary" ghost onClick={this.onClose}>
                  关闭
                </Button>
              </div>
            )
          }
          centered={true}
          width={800}
        >
          <div ref={obj => (this.divForm = obj)}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <div>短信内容</div>
                <div className={styles.line} />
              </div>
              <div className={styles.content}>
                <table className={styles.table}>
                  <tbody>
                    <tr>
                      <th>短信名字:</th>
                      <td>{form.templateName}</td>
                    </tr>
                    <tr>
                      <th>短信内容:</th>
                      <td>{form.smsContent}</td>
                    </tr>
                    <tr>
                      <th>短信链接:</th>
                      <td>{form.smsLink}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <div>发送条件</div>
                <div className={styles.line} />
              </div>
              <div className={styles.content}>
                <table className={styles.table}>
                  <tbody>
                    {search_age && (
                      // 年龄
                      <tr>
                        <th>{search_age.ContentTypeDes}:</th>
                        <td>
                          <div className={styles.ageline}>
                            从{form.search_age1}岁到{form.search_age2}岁
                          </div>
                        </td>
                      </tr>
                    )}

                    {search_sex && (
                      // 性别
                      <tr>
                        <th>{search_sex.ContentTypeDes}:</th>
                        <td>
                          {form.search_sex === '1' ? '男' : form.search_sex === '2' ? '女' : '不限'}
                        </td>
                      </tr>
                    )}
                    {search_region && (
                      // 区域
                      <tr>
                        <th>{search_region.ContentTypeDes}:</th>
                        <td>
                          <div className={styles.scroll}>
                            <Tree checkable checkedKeys={form.search_area} disabled={true}>
                              {this.renderTreeNodes(search_region.tree)}
                            </Tree>
                          </div>
                        </td>
                      </tr>
                    )}
                    {search_radius && form.search_checked_address && (
                      <React.Fragment>
                        <tr>
                          <th>商户地址:</th>
                          <td>{search_address}</td>
                        </tr>
                        {/* // 半径 */}
                        <tr>
                          <th>{search_radius.ContentTypeDes}:</th>
                          <td>{form.search_radius}公里</td>
                        </tr>
                      </React.Fragment>
                    )}
                    {search_userOrder && (
                      // 发送顺序
                      <tr>
                        <th>{search_userOrder.ContentTypeDes}:</th>
                        <td>
                          <div className={styles.tdOrder}>
                            {form.search_userOrder === '1' && '新用户优先'}
                            {form.search_userOrder === '2' && '老用户优先'}
                            {form.search_userOrder === '0' && '无'}
                          </div>
                        </td>
                      </tr>
                    )}
                    {!search_age &&
                      !search_sex &&
                      !search_region &&
                      !search_radius &&
                      !search_userOrder && <div className={styles.none}>无发送条件</div>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <div>反馈选项</div>
                <div className={styles.line} />
              </div>
              <div className={styles.content}>
                {reply_specificAge && (
                  <div className={styles.fk}>
                    <Checkbox checked={form.MSG_PRICE_TYPE_REPLY_AGE} disabled={true}>
                      {reply_specificAge.ContentTypeDes}
                    </Checkbox>
                  </div>
                )}
                {reply_birthday && (
                  <div className={styles.fk}>
                    <Checkbox checked={form.MSG_PRICE_TYPE_REPLY_BIRTHDAY} disabled={true}>
                      {reply_birthday.ContentTypeDes}
                    </Checkbox>
                  </div>
                )}
                {reply_familyEconomic && (
                  <div className={styles.fk}>
                    <Checkbox checked={form.MSG_PRICE_TYPE_REPLY_FAMILY_LEVEL} disabled={true}>
                      {reply_familyEconomic.ContentTypeDes}
                    </Checkbox>
                  </div>
                )}
                {reply_fullName && (
                  <div className={styles.fk}>
                    <Checkbox checked={form.MSG_PRICE_TYPE_REPLY_FULL_NAME} disabled={true}>
                      {reply_fullName.ContentTypeDes}
                    </Checkbox>
                  </div>
                )}
                {reply_sex && (
                  <div className={styles.fk}>
                    <Checkbox checked={form.MSG_PRICE_TYPE_REPLY_SEX} disabled={true}>
                      {reply_sex.ContentTypeDes}
                    </Checkbox>
                  </div>
                )}
                {reply_area && (
                  <div className={styles.fk}>
                    <Checkbox checked={form.MSG_PRICE_TYPE_REPLY_REGION} disabled={true}>
                      {reply_area.ContentTypeDes}
                    </Checkbox>
                  </div>
                )}
                {!reply_specificAge &&
                  !reply_birthday &&
                  !reply_familyEconomic &&
                  !reply_fullName &&
                  !reply_sex &&
                  !reply_area && <div className={styles.none}>无反馈选项</div>}
                <div className={styles.clear} />
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <div>短信条数</div>
                <div className={styles.line} />
              </div>
              <div className={styles.content}>
                <table className={styles.table}>
                  <tbody>
                    <tr>
                      <th>发送数量:</th>
                      <td>{form.count}</td>
                    </tr>
                    <tr>
                      <th>发送方式:</th>
                      <td>
                        {form.sendtype === '1' ? '立即发送' : '定时发送'} ({sendtime})
                      </td>
                    </tr>
                    <tr>
                      <th>单条价格:</th>
                      <td>{form.priceOne.toFixed(2)}元</td>
                    </tr>
                    <tr className={styles.yj}>
                      <th>总价:</th>
                      <td>{form.totalPrice}元</td>
                    </tr>
                    <tr>
                      <th>优惠金额:</th>
                      <td>{form.salePrice}元</td>
                    </tr>
                    <tr className={styles.sf}>
                      <th>实付金额:</th>
                      <td>{form.payMoney}元</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
