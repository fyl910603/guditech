import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, Icon, message,DatePicker,Modal,Select, Checkbox, Radio, Tree, InputNumber} from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';
import { ShortMessageTemplateEdit } from 'components/shortMessageTemplateEdit';
import router from 'umi/router';
import { getAreaData } from 'utils/getAreaData';
import { MessageBox } from 'components/messageBox';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { Input2 } from 'components/input';
import { debounce } from 'lodash';
interface Props {
  dispatch: (props: any) => void;
  data: any;
}

interface State {
  height: number;
  addvisible:boolean;
  typeValue:string;
  typeIndex:number;
  addOrderName:string;
}

class Component extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  private onGetExpectDebounce: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      addOrderName:'',
      height: 0,
      addvisible:false,
      typeValue:'',
      typeIndex:0
    };
    this.onGetExpectDebounce = debounce(this.onGetExpect, 300);
  }

  componentDidMount() {
    this.props.dispatch({
      type: `${namespace}/fetch`,
      payload: {
        container: this.divForm,
      },
    });

    window.addEventListener('resize', this.onResize);
    this.onResize();
  }
  componentDidUpdate(){
    if(!this.props.data.isShowConfirm){
      this.setState({
        addvisible:false
      })
    }
  }
  // componentWillUnmount() {
  //   if(this.props.data.templateList && this.props.data.templateList.length > 0){
  //     setTimeout(()=>{
  //       this.setState({
  //         typeValue:this.props.data.templateList[0].TemlateId
  //       })
  //     },200)
  //   }
  //   window.removeEventListener('resize', this.onResize);
  // }
  componentWillReceiveProps(nextProps){
    if(this.props.data.templateList && this.props.data.templateList.length > 0){
      this.setState(
        {
          typeValue:this.props.data.templateList[this.state.typeIndex].TemlateId
        }
      )
      }
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
  onGetExpect = () => {
    const { search_region, form } = this.props.data;
    this.props.dispatch({
      type: `${namespace}/getExpect`,
      payload: {
        search_area_dis: search_region ? getAreaData(search_region.tree, form.search_area) : '',
      },
    });
  };
  onResize = () => {
    this.setState({
      height: this.divForm.offsetHeight - 55 - 80,
    });
  };
  onDateChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onDateChanged`,
      payload: e,
    });
  };
  onSelect = e => {
    this.props.dispatch({
      type: `${namespace}/fetch`,
      payload: {
        container: this.divForm,
        pageindex: 1,
      },
    });
  };
  onOrderNameChange = e =>{
      this.setState({
        addOrderName:e.target.value
      })
  }
  onOrderSnChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onOrderSnChanged`,
      payload: e.target.value,
    });
  };
  onTemplateNameChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onTemplateNameChanged`,
      payload: e.target.value,
    });
  };
  onPageChanged = (pageindex, pagecount) => {
    this.props.dispatch({
      type: `${namespace}/fetch`,
      payload: {
        pageindex,
        container: this.divForm,
      },
    });
  };
  onOpenEdit = record => {
    this.props.dispatch({
      type: `${namespace}/showEdit`,
      payload: {
        currData: record,
        isShowEdit: true,
      },
    });
  };
  handleCancel = (e) => {
    this.setState({
      addvisible: false,
    });
  }
  openAdd = () => {
    this.setState({
      addvisible: true,
    });
  }
  addSave = () =>{
    const { search_region, form } = this.props.data;
    this.props.dispatch({
      type: `${namespace}/onSave`,
      payload: {
        addOrderName:this.state.addOrderName,
        templateId:this.state.typeValue,
        search_area_dis: search_region ? getAreaData(search_region.tree, form.search_area) : '',
      },
    });
  }
  onSearchCheckedAddressChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onSearchCheckedAddressChanged`,
      payload: e.target.checked,
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
  onCloseEdit = () => {
    this.props.dispatch({
      type: `${namespace}/showEdit`,
      payload: {
        isShowEdit: false,
      },
    });
  };
  onChangeTemplate = (value) => {
    this.getfetchPrice(value)
    this.setState({
      typeValue:value
    })
    if(this.props.data.templateList.length>0){
      this.setState({
        typeIndex:this.searchType(this.props.data.templateList,value)
      })
    }
  }
  searchType = (arr, dst)=>{
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].TemlateId == dst) {
        return j;
      }
    }
  }
  getfetchPrice = (ptid) => {
    this.props.dispatch({
      type: `${namespace}/fetchPrice`,
      payload: {
        TemlateId: ptid,
      },
    });
  }
  onSearchAge1Changed = value => {
    this.props.dispatch({
      type: `${namespace}/onSearchAge1Changed`,
      payload: value,
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
  onSearchSexChanged = value => {
    this.props.dispatch({
      type: `${namespace}/onSearchSexChanged`,
      payload: value,
    });
    this.onGetExpectDebounce();
  };
  onDelete = (h)=>{
    this.props.dispatch({
      type: `${namespace}/onDelete`,
      payload: h.OrderId,
    });
  }
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
  onSearchAreaChanged = value => {
    this.props.dispatch({
      type: `${namespace}/onSearchAreaChanged`,
      payload: value,
    });
    this.onGetExpectDebounce();
  };
  onSend = d => {
    if(this.props.data.priceList.length > 0){
        router.push(`/shortMessage/templateListForSend/send?id=${d.TemplateSysId}`);
    }else{
      MessageBox.show('价格模板不存在', this.divForm);
    }
  };

  onOpenOrderList = record => {
    router.push(`/shortMessage/templateListForSend/orderList?clear=1`);
  };

  onGotoAddTemplate = () => {
    router.push('/shortMessage/templateList');
  };
  render() {
    const { list, 
      totalCount, 
      pageindex, 
      pagecount, 
      isShowEdit, 
      currData,
      timeRange, 
      ordername,
      ordersn,
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
      templateList
    } = this.props.data;
    const td2Style = { width: '60px', textAlign: 'right' };
    const thWidth = 120;
    const { height } = this.state;
    const columns: any = [
      {
        title: '订单号',
        dataIndex: 'OrderSn',
        width: 90,
        align: 'center',
      },
      {
        title: '订单名称',
        dataIndex: 'OrderName',
        width: 120,
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'CreateTime',
        width: 150,
        align: 'center',
      },
      {
        title: '最新拨打时间',
        dataIndex: 'LastCallTime',
        width: 150,
        align: 'center',
      },
      {
        title: '已拨打次数',
        dataIndex: 'CallCount',
        width: 120,
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        width: 310,
        align: 'center',
        // fixed: 'right',
        render: (text, h) => (
          <span>
            {
              <React.Fragment>
                <div className={styles.option}>
                <a href="javascript:;" onClick={() => this.onOpenEdit(h)}>
                    订单详情
                  </a>
                  <br />
                  <a href="javascript:;" onClick={() => this.onOpenEdit(h)}>
                    电话详情
                  </a>
                  <br />
                  <a href="javascript:;" onClick={() => this.onOpenEdit(h)}>
                    拨打记录
                  </a>
                  <br />
                  <a href="javascript:;" onClick={() => this.onDelete(h)} className={styles.delete}>
                    删除
                  </a>
                  <br />
                </div>
              </React.Fragment>
            }
          </span>
        ),
      },
    ];

    return (
      <div className={styles.main} ref={obj => (this.divForm = obj)}>
        <div className={styles.condition}>
          <Input2
            placeholder="订单号"
            value={ordersn}
            className={styles.searchInput}
            onChange={this.onTemplateNameChanged}
          />
          <Input2 placeholder="订单名称" value={ordername} onChange={this.onOrderSnChanged} className={styles.searchInput}/>
          <DatePicker.RangePicker onChange={this.onDateChanged} value={timeRange}/>
          <Button ghost type="primary" className={styles.btn} onClick={this.onSelect}>
            搜索
          </Button>
        </div>
        <div className={styles.createBtnBox}>
          <span className={styles.createBtn} onClick={this.openAdd}>创建订单</span>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          pagination={false}
          className={styles.tableContent}
          scroll={{ y: height }}
          rowKey="OrderId"
          bordered={true}
          locale={{
            emptyText: '暂无短信内容模板，请前往短信模板创建',
          }}
        />
        <SplitPage
          pageIndex={pageindex}
          total={totalCount}
          pageSize={pagecount}
          onPageChanged={this.onPageChanged}
        />

        {totalCount < 1 && (
          <Button
            onClick={this.onGotoAddTemplate}
            className={styles.btnAddTemplate}
            type="primary"
            ghost
          >
            立即创建
          </Button>
        )}
        {/* 创建订单 */}
        <Modal title="创建订单" visible={this.state.addvisible}
          style={{ top: 200}}
          width='830px'
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.addSave}>
              提交
            </Button>,
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          ]}
        >
        <div className={styles.form}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <div>订单名称</div>
              <Input2 placeholder="订单名称" value={this.state.addOrderName} onChange={this.onOrderNameChange} className={styles.orderInput}/>
            </div>
            <div className={styles.selectBox}>
              
            </div>
            <div className={styles.cardTitle}>
              <div>价格模板:</div>
              <div className={styles.selectBox}>
              <Select
                placeholder="请选择模板"
                value={this.state.typeValue}
                className={styles.age}
                onSelect={this.onChangeTemplate}
                style={{ width: 190 }}
              >
                {templateList.map(h => (
                  <Select.Option key={h.TemlateId} value={h.TemlateId}>{h.TemlateName}</Select.Option>
                ))}
              </Select>
            </div>
            </div>
          </div>
        </div>
        <div className={styles.form}>

        <div className={styles.card}>
            <div className={styles.cardTitle}>
              <div>搜索条件</div>
              <div className={styles.line} />
            </div>
            <div className={styles.content}>
              <Form>
                {(
                  // 年龄
                  <FormItem
                    title="年龄"
                    thWidth={thWidth}
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
                        {search_age && search_age.list?search_age.list.map(h => (
                          <Select.Option key={String(h)}>{h}岁</Select.Option>
                        )):''}
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
                        {search_age && search_age.list?search_age.list.map(h => (
                          <Select.Option key={String(h)}>{h}岁</Select.Option>
                        )):''}
                      </Select>
                    </div>
                  </FormItem>
                )}
                {(
                  // 性别
                  <FormItem
                    title="性别"
                    thWidth={thWidth}
                  >
                    <Select
                      placeholder="请选择性别"
                      className={styles.sex}
                      onSelect={this.onSearchSexChanged}
                      value={form.search_sex}
                      disabled={search_isReadonly}
                    >
                      {search_sex && search_sex.list?search_sex.list.map(h => (
                        <Select.Option key={String(h.value)} value={h.value}>
                          {h.text}
                        </Select.Option>
                      )):''}
                    </Select>
                  </FormItem>
                )}
                {(
                  // 区域
                  <FormItem
                  title="区域"
                  thWidth={thWidth}
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
                        {search_region && search_region.tree?this.renderTreeNodes(search_region.tree):''}
                      </Tree>
                    </div>
                  </FormItem>
                )}
                {(
                  <React.Fragment>
                    <FormItem
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
                    <FormItem title="半径范围" thWidth={thWidth}>
                      <div className={styles.ageline}>
                        <Select
                          placeholder="请选择半径"
                          className={styles.age}
                          onSelect={this.onSearchRadiusChanged}
                          value={form.search_radius}
                          style={{ width: 120 }}
                          disabled={!form.search_checked_address || search_isReadonly}
                        >
                          {search_radius && search_radius.list?search_radius.list.map(h => (
                            <Select.Option key={String(h)}>{h}公里</Select.Option>
                          )):''}
                        </Select>
                      </div>
                    </FormItem>
                  </React.Fragment>
                )}
                {(
                  // 发送顺序
                  <FormItem
                    title="用户优先"
                    thWidth={thWidth}
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
        </div>
        </Modal>
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