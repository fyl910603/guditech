import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button, Select, Checkbox, Radio, DatePicker, Tree, InputNumber } from 'antd';
import { MessageBox } from 'components/messageBox';
import { namespace } from './model';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { ShortMessageSendConfirm } from 'components/shortMessageSendConfirm';
import { isNullOrUndefined, toFixed2 } from 'utils/util';
import { getAreaData } from 'utils/getAreaData';
import { debounce } from 'lodash';
import templateList from '../../templateList';

interface Props {
  data: any;
  dispatch: (props: any) => void;
}
interface State {
  templateid: string,
  typeValue:any;
  typeIndex:number;
}
function computePrice(state) {
  let price = 0;
  const {
    form,
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
  } = state;
  if (search_age) {
    price += (search_age.ContentPrice*100);
  }
  if (search_sex) {
    price += (search_sex.ContentPrice*100);
  }
  if (search_region) {
    price += (search_region.ContentPrice*100);
  }
  if (form.search_checked_address) {
    price += (search_radius.ContentPrice*100);
  }
  if (search_userOrder) {
    price += (search_userOrder.ContentPrice*100);
  }

  if (form.MSG_PRICE_TYPE_REPLY_AGE) {
    price += (reply_specificAge.ContentPrice*100);
  }
  if (form.MSG_PRICE_TYPE_REPLY_BIRTHDAY) {
    price += (reply_birthday.ContentPrice*100);
  }
  if (form.MSG_PRICE_TYPE_REPLY_FAMILY_LEVEL) {
    price += (reply_familyEconomic.ContentPrice*100);
  }
  if (form.MSG_PRICE_TYPE_REPLY_FULL_NAME) {
    price += (reply_fullName.ContentPrice*100);
  }
  if (form.MSG_PRICE_TYPE_REPLY_SEX) {
    price += (reply_sex.ContentPrice*100);
  }
  if (form.MSG_PRICE_TYPE_REPLY_REGION) {
    price += (reply_area.ContentPrice*100);
  }

  return price / 100
}

const sexMap = {
  '0': '不限',
  '1': '男',
  '2': '女',
};

class Component extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  private onGetExpectDebounce: any;
  constructor(props) {
    super(props);
    this.state = {
      templateid: '',
      typeValue:'',
      typeIndex:0
    };
    this.onGetExpectDebounce = debounce(this.onGetExpect, 300);
  }

  check() {
    const { data } = this.props;
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
      // basePrice,
      isShowConfirm,
      // minSendCount,
    } = data;
    if (search_age) {
      if (isNullOrUndefined(form.search_age1) || isNullOrUndefined(form.search_age2)) {
        MessageBox.show('请选择年龄', this.divForm);
        return false;
      }
      if (parseInt(form.search_age1) > parseInt(form.search_age2)) {
        MessageBox.show('最大年龄应大于等于最小年龄', this.divForm);
        return false;
      }
    }
    if (form.search_checked_address) {
      if (!form.search_radius) {
        MessageBox.show('请选择半径范围', this.divForm);
        return false;
      }
    }
    if(this.props.data.TypeList.length > 0){
      if (isNullOrUndefined(form.count) || form.count < this.props.data.TypeList[0].MinSendCount) {
        MessageBox.show(`发送数量最少${this.props.data.TypeList[0].MinSendCount}条`, this.divForm);
        return false;
      }
    }
    if (form.sendtype === '2' && !form.sendtime) {
      MessageBox.show('请选择发送时间', this.divForm);
      return false;
    }
    return true;
  }

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

  onSearchAge1Changed = value => {
    this.props.dispatch({
      type: `${namespace}/onSearchAge1Changed`,
      payload: value,
    });
    this.onGetExpectDebounce();
  };
  onSearchAge2Changed = value => {
    this.props.dispatch({
      type: `${namespace}/onSearchAge2Changed`,
      payload: value,
    });
    this.onGetExpectDebounce();
  };
  onSearchSexChanged = value => {
    this.props.dispatch({
      type: `${namespace}/onSearchSexChanged`,
      payload: value,
    });
    this.onGetExpectDebounce();
  };
  onSearchAreaChanged = value => {
    this.props.dispatch({
      type: `${namespace}/onSearchAreaChanged`,
      payload: value,
    });
    this.onGetExpectDebounce();
  };
  onSearchCheckedAddressChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onSearchCheckedAddressChanged`,
      payload: e.target.checked,
    });
    this.onGetExpectDebounce();
  };
  onSearchRadiusChanged = value => {
    this.props.dispatch({
      type: `${namespace}/onSearchRadiusChanged`,
      payload: value,
    });
    this.onGetExpectDebounce();
  };
  onSearchUserOrderNew = e => {
    this.props.dispatch({
      type: `${namespace}/onSearchUserOrderNew`,
      payload: e.target.checked,
    });
    this.onGetExpectDebounce();
  };
  onSearchUserOrderOld = e => {
    this.props.dispatch({
      type: `${namespace}/onSearchUserOrderOld`,
      payload: e.target.checked,
    });
    this.onGetExpectDebounce();
  };

  onFeedbackChanged = (type, e) => {
    this.props.dispatch({
      type: `${namespace}/onFeedbackChanged`,
      payload: {
        type,
        value: e.target.checked,
      },
    });
    this.onGetExpectDebounce();
  };
  onFetchPriceList = () => {
    this.props.dispatch({
      type: `${namespace}/fetchPriceList`,
      payload: {
      },
    });
  };
  
  onCountChanged = value => {
    this.props.dispatch({
      type: `${namespace}/onCountChanged`,
      payload: value,
    });
    // this.onGetExpectDebounce();
  };

  onGetExpect = () => {
    const { search_region, form } = this.props.data;
    this.props.dispatch({
      type: `${namespace}/getExpect`,
      payload: {
        search_area_dis: search_region ? getAreaData(search_region.tree, form.search_area) : '',
      },
    });
  };

  onSendTypeChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onSendTypeChanged`,
      payload: e.target.value,
    });
  };

  onSendTimeChanged = value => {
    this.props.dispatch({
      type: `${namespace}/onSendTimeChanged`,
      payload: value,
    });
  };

  onShowConfirm = price => {
    if (!this.check()) {
      return;
    }
    const { search_region, form } = this.props.data;
    this.props.dispatch({
      type: `${namespace}/onShowConfirm`,
      payload: {
        price,
        search_area_dis: search_region ? getAreaData(search_region.tree, form.search_area) : '',
      },
    });
  };

  onCloseConfirm = () => {
    if (!this.check()) {
      return;
    }
    this.props.dispatch({
      type: `${namespace}/onShowConfirmDone`,
      payload: false,
    });
  };

  onSave = (div: HTMLDivElement) => {
    const { search_region, form } = this.props.data;
    this.props.dispatch({
      type: `${namespace}/onSave`,
      payload: {
        container: div,
        search_area_dis: search_region ? getAreaData(search_region.tree, form.search_area) : '',
      },
    });
  };

  formatMoney = (money, brackets?: boolean) => {
    if (money > 0) {
      const value = toFixed2(money / 100) + '元';
      if (brackets) {
        return `(${value})`;
      }
      return value;
    }
    return '';
  };
  onChangeTemplate = (value) => {
    this.getfetchPrice(value)
    this.setState({
      typeValue:value
    })
    if(this.props.data.TypeList.length>0){
      this.setState({
        typeIndex:this.searchType(this.props.data.TypeList,value)
      })
    }
  }
  searchType = (arr, dst)=>{
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].PtId == dst) {
        return j;
      }
    }
  }
  getfetchPrice = (ptid) => {
    this.props.dispatch({
      type: `${namespace}/fetchPrice`,
      payload: {
        PtId: ptid,
      },
    });
  }
  componentWillMount(){
    if(this.props.data.TypeList.length > 0){
      setTimeout(()=>{
        this.setState({
          typeValue:this.props.data.TypeList[0].PtId
        })
      },200)
    }
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps){
    if(this.props.data.TypeList.length > 0){
      this.setState(
        {
          typeValue:this.props.data.TypeList[this.state.typeIndex].PtId
        }
      )
      }
  }
  // componentDidUpdate(){
  //   if(this.props.data.TypeList.length > 0){
  //     this.getfetchPrice(this.props.data.TypeList[0].PtId)
  //     this.setState({
  //       typeValue:this.props.data.TypeList[0].PtId
  //     })
  //     console.log(this.props.data.TypeList[0].PtId)
  //   }
  // }
  render() {
    const { data } = this.props;
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
      // basePrice,
      isShowConfirm,
      search_isReadonly,
      search_address,
      // minSendCount,
      expectCount,
      TypeList
    } = data;
    console.log(this.props.data)
    let price = 0;
    let minSendCount,basePrice;
    if(TypeList.length > 0){
      basePrice = TypeList[this.state.typeIndex].BasePrice
      price = computePrice(data)+basePrice
      minSendCount = TypeList[this.state.typeIndex].MinSendCount
    }
    // price = computePrice(data) + templateList[this.state.typeValue].BasePrice    ; // 单价
    const td2Style = { width: '60px', textAlign: 'right' };
    const thWidth = 120;

    let dynamicInfoLine1 = '';
    let dynamicInfoLine2 = '';

    if (search_age) {
      dynamicInfoLine1 += `年龄从${form.search_age1 || ''}岁到${form.search_age2 || ''}岁，`;
    }
    if (search_sex) {
      dynamicInfoLine1 += `性别${sexMap[form.search_sex] || ''}，`;
    }
    if (search_region) {
      const allKeys: string[] = (search_region.tree || []).map(item => item.key);
      const selectedKeys = form.search_area || [];
      const notSelectedCount = allKeys.filter(item => selectedKeys.indexOf(item) < 0).length;

      dynamicInfoLine1 += `发送至${
        notSelectedCount === 0 || selectedKeys.length === 0 ? '全部，' : '部分地址，'
        }`;
    }
    if (search_radius && form.search_checked_address) {
      dynamicInfoLine1 += `商户半径范围${form.search_radius || ''}公里，`;
    }
    if (search_userOrder) {
      if (form.search_userOrder === '1') {
        dynamicInfoLine1 += `新用户优先，`;
      }
      if (form.search_userOrder === '2') {
        dynamicInfoLine1 += `老用户优先，`;
      }
    }

    if (reply_specificAge && form.MSG_PRICE_TYPE_REPLY_AGE) {
      dynamicInfoLine2 += `${reply_specificAge.ContentTypeDes}，`;
    }
    if (reply_birthday && form.MSG_PRICE_TYPE_REPLY_BIRTHDAY) {
      dynamicInfoLine2 += `${reply_birthday.ContentTypeDes}，`;
    }
    if (reply_familyEconomic && form.MSG_PRICE_TYPE_REPLY_FAMILY_LEVEL) {
      dynamicInfoLine2 += `${reply_familyEconomic.ContentTypeDes}，`;
    }
    if (reply_fullName && form.MSG_PRICE_TYPE_REPLY_FULL_NAME) {
      dynamicInfoLine2 += `${reply_fullName.ContentTypeDes}，`;
    }
    if (reply_sex && form.MSG_PRICE_TYPE_REPLY_SEX) {
      dynamicInfoLine2 += `${reply_sex.ContentTypeDes}，`;
    }
    if (reply_area && form.MSG_PRICE_TYPE_REPLY_REGION) {
      dynamicInfoLine2 += `${reply_area.ContentTypeDes}，`;
    }

    return (
      <div className={styles.page} ref={obj => (this.divForm = obj)}>
        <div className={styles.form}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <div>选择价格模板</div>
              <div className={styles.line} />
            </div>
            <div className={styles.selectBox}>
              <Select
                placeholder="请选择模板"
                value={this.state.typeValue}
                className={styles.age}
                onSelect={this.onChangeTemplate}
                style={{ width: 300 }}
              >
                {TypeList.map(h => (
                  <Select.Option key={h.PtId} value={h.PtId}>{h.PtName}</Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <div className={styles.form}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <div>发送条件</div>
              <div className={styles.line} />
            </div>
            <div className={styles.content}>
              <Form>
                {search_age && (
                  // 年龄
                  <FormItem
                    title={`${search_age.ContentTypeDes || ''}:`}
                    thWidth={thWidth}
                    td2={this.formatMoney(search_age.ContentPrice)}
                    td2Style={td2Style}
                  >
                    <div className={styles.ageline}>
                      从
                      <Select
                        placeholder="请选择年龄"
                        className={styles.age}
                        onSelect={this.onSearchAge1Changed}
                        value={form.search_age1}
                        style={{ width: 120 }}
                        disabled={search_isReadonly}
                      >
                        {search_age.list.map(h => (
                          <Select.Option key={String(h)}>{h}岁</Select.Option>
                        ))}
                      </Select>
                      到
                      <Select
                        placeholder="请选择年龄"
                        className={styles.age}
                        onSelect={this.onSearchAge2Changed}
                        value={form.search_age2}
                        style={{ width: 120 }}
                        disabled={search_isReadonly}
                      >
                        {search_age.list.map(h => (
                          <Select.Option key={String(h)}>{h}岁</Select.Option>
                        ))}
                      </Select>
                    </div>
                  </FormItem>
                )}
                {search_sex && (
                  // 性别
                  <FormItem
                    title={`${search_sex.ContentTypeDes || ''}:`}
                    thWidth={thWidth}
                    td2={this.formatMoney(search_sex.ContentPrice)}
                    td2Style={td2Style}
                  >
                    <Select
                      placeholder="请选择性别"
                      className={styles.sex}
                      onSelect={this.onSearchSexChanged}
                      value={form.search_sex}
                      disabled={search_isReadonly}
                    >
                      {search_sex.list.map(h => (
                        <Select.Option key={String(h.value)} value={h.value}>
                          {h.text}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                )}
                {search_region && (
                  // 区域
                  <FormItem
                    title={`${search_region.ContentTypeDes || ''}:`}
                    thWidth={thWidth}
                    td2={this.formatMoney(search_region.ContentPrice)}
                    td2Style={td2Style}
                    splitHeight={0}
                  >
                    <div className={styles.scroll}>
                      <Tree
                        defaultExpandAll
                        checkable
                        onCheck={this.onSearchAreaChanged}
                        checkedKeys={form.search_area}
                        filterTreeNode={() => false}
                        disabled={search_isReadonly}
                      >
                        {this.renderTreeNodes(search_region.tree)}
                      </Tree>
                    </div>
                  </FormItem>
                )}
                {search_radius && (
                  <React.Fragment>
                    <FormItem
                      td2={this.formatMoney(search_radius.ContentPrice)}
                      thWidth={thWidth}
                      title={
                        <div>
                          <Checkbox
                            onChange={this.onSearchCheckedAddressChanged}
                            checked={form.search_checked_address}
                            disabled={search_isReadonly}
                          >
                            商户地址:
                          </Checkbox>
                        </div>
                      }
                      td2Style={{ ...td2Style, paddingTop: '13px' }}
                    >
                      <div className={styles.address}>{search_address}</div>
                    </FormItem>
                    {/* 半径 */}
                    <FormItem title={`${search_radius.ContentTypeDes || ''}:`} thWidth={thWidth}>
                      <div className={styles.ageline}>
                        <Select
                          placeholder="请选择半径"
                          className={styles.age}
                          onSelect={this.onSearchRadiusChanged}
                          value={form.search_radius}
                          style={{ width: 120 }}
                          disabled={!form.search_checked_address || search_isReadonly}
                        >
                          {search_radius.list.map(h => (
                            <Select.Option key={String(h)}>{h}公里</Select.Option>
                          ))}
                        </Select>
                      </div>
                    </FormItem>
                  </React.Fragment>
                )}
                {search_userOrder && (
                  // 发送顺序
                  <FormItem
                    title={`${search_userOrder.ContentTypeDes || ''}:`}
                    thWidth={thWidth}
                    td2={this.formatMoney(search_userOrder.ContentPrice)}
                    td2Style={td2Style}
                  >
                    <div className={styles.tdOrder}>
                      <Checkbox
                        onChange={this.onSearchUserOrderNew}
                        checked={form.search_userOrder === '1'}
                        disabled={search_isReadonly}
                      >
                        新用户优先
                      </Checkbox>
                      <Checkbox
                        onChange={this.onSearchUserOrderOld}
                        checked={form.search_userOrder === '2'}
                        disabled={search_isReadonly}
                      >
                        老用户优先
                      </Checkbox>
                    </div>
                  </FormItem>
                )}
              </Form>
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
                  <Checkbox
                    onChange={e => this.onFeedbackChanged(reply_specificAge.ContentType, e)}
                    checked={form.MSG_PRICE_TYPE_REPLY_AGE}
                  >
                    {reply_specificAge.ContentTypeDes}&nbsp;
                    {this.formatMoney(reply_specificAge.ContentPrice, true)}
                  </Checkbox>
                </div>
              )}
              {reply_birthday && (
                <div className={styles.fk}>
                  <Checkbox
                    onChange={e => this.onFeedbackChanged(reply_birthday.ContentType, e)}
                    checked={form.MSG_PRICE_TYPE_REPLY_BIRTHDAY}
                  >
                    {reply_birthday.ContentTypeDes}&nbsp;
                    {this.formatMoney(reply_birthday.ContentPrice, true)}
                  </Checkbox>
                </div>
              )}
              {reply_familyEconomic && (
                <div className={styles.fk}>
                  <Checkbox
                    onChange={e => this.onFeedbackChanged(reply_familyEconomic.ContentType, e)}
                    checked={form.MSG_PRICE_TYPE_REPLY_FAMILY_LEVEL}
                  >
                    {reply_familyEconomic.ContentTypeDes}&nbsp;
                    {this.formatMoney(reply_familyEconomic.ContentPrice, true)}
                  </Checkbox>
                </div>
              )}
              {reply_fullName && (
                <div className={styles.fk}>
                  <Checkbox
                    onChange={e => this.onFeedbackChanged(reply_fullName.ContentType, e)}
                    checked={form.MSG_PRICE_TYPE_REPLY_FULL_NAME}
                  >
                    {reply_fullName.ContentTypeDes}&nbsp;
                    {this.formatMoney(reply_fullName.ContentPrice, true)}
                  </Checkbox>
                </div>
              )}
              {reply_sex && (
                <div className={styles.fk}>
                  <Checkbox
                    onChange={e => this.onFeedbackChanged(reply_sex.ContentType, e)}
                    checked={form.MSG_PRICE_TYPE_REPLY_SEX}
                  >
                    {reply_sex.ContentTypeDes}&nbsp;{this.formatMoney(reply_sex.ContentPrice, true)}
                  </Checkbox>
                </div>
              )}
              {reply_area && (
                <div className={styles.fk}>
                  <Checkbox
                    onChange={e => this.onFeedbackChanged(reply_area.ContentType, e)}
                    checked={form.MSG_PRICE_TYPE_REPLY_REGION}
                  >
                    {reply_area.ContentTypeDes}&nbsp;
                    {this.formatMoney(reply_area.ContentPrice, true)}
                  </Checkbox>
                </div>
              )}
              <div className={styles.clear} />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <div>其它</div>
              <div className={styles.line} />
            </div>
            <div className={styles.contentOther}>
              {/* <div className={styles.dqmt}>当前每条信息:{toFixed2(price)}元</div> */}
              <Form>
                <FormItem title="发送数量:" td1Style={{ paddingTop: 7 }}>
                  <InputNumber
                    onChange={this.onCountChanged}
                    value={form.count}
                    placeholder="发送数量"
                  />
                  <span className={styles.spanz}>(最少{minSendCount}条起发)</span>
                </FormItem>
                <FormItem title="发送时间:">
                  <div className={styles.time}>
                    <Radio.Group onChange={this.onSendTypeChanged} value={form.sendtype}>
                      <Radio value={'1'}>立即发送</Radio>
                      <Radio value={'2'}>定时发送</Radio>
                    </Radio.Group>
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="请选择时间"
                      disabled={form.sendtype === '1'}
                      onChange={this.onSendTimeChanged}
                      value={form.sendtime}
                    />
                  </div>
                </FormItem>
              </Form>
            </div>
          </div>
          <div className={styles.divButton}>
            <Button type="primary" ghost onClick={() => this.onShowConfirm(price)}>
              下一步
            </Button>
          </div>

          <div className={styles.dynamicInfoH} />
          <div className={styles.dynamicInfo}>
            {dynamicInfoLine1 && (
              <div className={styles.l1}>
                <div>{dynamicInfoLine1.replace(/^，|，$/g, '')}</div>
              </div>
            )}
            {dynamicInfoLine2 && (
              <div className={styles.l2}>
                <div>{dynamicInfoLine2.replace(/^，|，$/g, '')}</div>
              </div>
            )}

            <div className={styles.l3}>
              <div>
                满足条件用户{expectCount || 0}人，发送数量{form.count || 0}条，当前价格
                {toFixed2(price/100)}元/条
              </div>
            </div>
          </div>
        </div>

        {isShowConfirm && (
          <ShortMessageSendConfirm
            onClose={this.onCloseConfirm}
            data={data}
            onSave={this.onSave}
            doType="send"
          />
        )}
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
