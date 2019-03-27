import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, DatePicker,Icon,Modal,Tooltip,Input,Dropdown,Menu} from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';
import router from 'umi/router';
import { confirm } from 'components/confirm';
import { Input2 } from 'components/input';
import { ShortMessageSendConfirm } from 'components/shortMessageSendConfirm';
import { CallTelephone } from 'components/callTelephone';
interface Props {
  dispatch: (props: any) => void;
  data: any;
}

interface State {
  height: number;
  phonevisible:boolean,
  phoneInfo:string,
  smsvisible:boolean,
  remarkvisible:boolean,
  selectData: object,
  smsInfo:string,
  orderData:Object,
  isShowTempTab: boolean,
  templateid: any,
  Remark:any
}

const stateMap = {
  0: '通话中',
  1: '已接通',
  2: '未接通',
};
const stateSmsMap = {
  0: '等待发送',
  1: '正在发送',
  2: '发送失败',
  3: '发送成功'
};
class Component extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      height: 0,
      phonevisible:false,
      isShowTempTab: false,
      selectData: {},
      phoneInfo:'',
      smsvisible:false,
      remarkvisible:false,
      smsInfo:'',
      Remark:'',
      templateid: '',
      orderData:{
      }
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.setState({
      height: this.divForm.offsetHeight - 55 - 80 - 50,
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

  onPageChanged = (pageindex, pagecount) => {
    this.props.dispatch({
      type: `${namespace}/fetch`,
      payload: {
        pageindex,
        container: this.divForm,
      },
    });
  };

  onDateChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onDateChanged`,
      payload: e,
    });
  };

  onMobileChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onMobileChanged`,
      payload: e.target.value,
    });
  };
  // 打开短信操作
  getFamilyData = record => {
    this.setState({
      selectData: record
    })
    this.onChangeTempStatus()
  }
  onOpenTemD = record => {
    this.setState({
      templateid: record,
      isShowTempTab: true,
    })
  }
   // 发送短信
   onSend = () => {
    this.props.dispatch({
      type: `${namespace}/fetchSend`,
      payload: {
        orderid: this.state.selectData.OrderId,
        familyid: this.state.selectData.FamilyId,
        addressid: this.state.selectData.AddressId,
        childid: this.state.selectData.ChildId,
        templateid: this.state.templateid,
        container: this.divForm
      },
    });
  }
  onChangeTempStatus = () => {
    this.props.dispatch({
      type: `${namespace}/ChangeTempModal`
    });
  }
  onCancelSend = h => {
    confirm({
      title: '确定要取消短信发送吗？',
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/onCancelSend`,
          payload: h.OrderId,
        });
      },
    });
  };
  onOpenDetail = h => {
    this.props.dispatch({
      type: `${namespace}/onOpenDetail`,
      payload: h.OrderId,
    });
  };
  onCloseDetail = () => {
    this.props.dispatch({
      type: `${namespace}/onCloseDetail`,
      payload: {},
    });
  };
  // 获取电话明细
  getPhoneDetail = (orderid,familyid)=>{
    this.props.dispatch({
      type:`${namespace}/fetchPhoneDetail`,
      payload:{
        orderid:orderid,
        familyid:familyid
      }
    })
  }
  // 获取短信明细
  getSmsDetail = (orderid,familyid)=>{
    this.props.dispatch({
      type:`${namespace}/fetchSmsDetail`,
      payload:{
        orderid:orderid,
        familyid:familyid
      }
    })
  }
  // 保存备注
  submitRemark = () => {
    confirm({
      title: '内容文本已被修改，是否进行保存再退出？',
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/fetchRemark`,
          payload: {
          },
        });
      },
    });
  };
  handleCancel = () =>{
    this.setState({
      phonevisible:false,
      smsvisible:false,
      remarkvisible:false,
      isShowTempTab: false,
    })
  }
  toDial = record =>{
    this.props.dispatch({
      type: `${namespace}/onOpenCall`,
      payload: record,
    });
  }
  OpenPhoneDetail = record =>{
    this.getPhoneDetail(record.OrderId,record.FamilyId)
    let _this = this
    setTimeout(()=>{
      _this.setState({
        phonevisible:true,
        phoneInfo:record.Mobile
      })
    },100)
  }
  OpenSmsDetail = record =>{
    this.getSmsDetail(record.OrderId,record.FamilyId)
    let _this = this
    setTimeout(()=>{
      _this.setState({
        smsvisible:true,
        smsInfo:record.Mobile
      })
    },100)
  }
  // 打开备注
  OpenRemark = record =>{
    this.props.dispatch({
      type: `${namespace}/fetchRemarkFalse`,
      payload: record,
    });
    setTimeout(()=>{
      this.setState({
        remarkvisible:true,
        orderData:Object.assign(record),
      })
    },50)
  }
  // 备注改变
  changeRemark = (e) =>{
    this.props.dispatch({
      type: `${namespace}/changeRemark`,
      payload: e.target.value
    })
  }
  // 默认坐席改变
  onchangeD = () =>{
    this.props.dispatch({
    type: `${namespace}/fetchPhoneSeat`,
    payload: {
    }
  })
  }
  // 关闭拨打电话窗口
  onCloseMobile = () =>{
    this.props.dispatch({
    type: `${namespace}/fetchCloseMobile`,
    payload: {
    }
  })
  }
  onParentChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onParentChanged`,
      payload: e.target.value,
    });
  };
  formatSeconds = (a)=>{
      var hh = parseInt(a/3600);  
      if(hh<10) hh = "0" + hh;  
      var mm = parseInt((a-hh*3600)/60);  
      if(mm<10) mm = "0" + mm;  
      var ss = parseInt((a-hh*3600)%60);  
      if(ss<10) ss = "0" + ss;  
      var length = hh + ":" + mm + ":" + ss;  
      if(a>0){  
        return length;  
      }else{  
        return "00:00:00";  
      }  
    }
  render() {
    const {
      list,
      seatList,
      CallData,
      totalCount,
      pageindex,
      pagecount,
      timeRange,
      mobile,
      parent,
      isShowCall,
      isShowDetail,
      templateList,
      isShowRemark,
      orderDetail,
      isShowTemplateD,
      phoneList,
      currData,
      Remark,
      smsList
    } = this.props.data;
    const { height } = this.state;
    var priceTempList = '';
    if (templateList && templateList.length > 0) {
      priceTempList = templateList.map((h, index) => (
        <Menu.Item key={h.TemplateSysId}>
          <a href="javascript:;" onClick={() => this.onOpenTemD(h.TemplateSysId)}>{h.TemplateName}</a>
        </Menu.Item>
      ))
    }
    // 模板表格
    const columnsTemp: any = [
      {
        title: '模板名称',
        dataIndex: 'TemplateName',
        align: 'center',
        width: 200,
      },
      {
        title: '模板内容',
        dataIndex: 'SmsContent',
        align: 'center',
        width: 200,
      },
      {
        title: 'URL链接',
        dataIndex: 'SmsLink',
        align: 'center',
        width: 200,
      }
    ];
    const columns: any = [
      {
        title: '订单号码',
        dataIndex: 'OrderId',
        width: 100,
        align: 'center',
      },
      {
        title: '父母',
        dataIndex: 'Father',
        align: 'center',
        render: (text,h) => {
          return `${h.Father}/${h.Mother}`
        },
      },
      {
        title: '手机号码',
        dataIndex: 'Mobile',
        width: 120,
        align: 'center',
      },
      {
        title: '最新拨打时间',
        dataIndex: 'LastCallTime',
        width: 100,
        align: 'center',
      },
      {
        title: '最新状态',
        dataIndex: 'LastStatus',
        width: 110,
        align: 'center',
        render: (text, h) => {
          return stateMap[h.LastStatus]
        },
      },
      {
        title: '最新通话时长',
        width: 120,
        align: 'center',
        render: (text,h) =>{
            return <span>{this.formatSeconds(h.LastCallSecond)}</span>
        }
      },
      {
        title: '被拨打次数',
        dataIndex: 'CallTimes',
        width: 120,
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        width: 300,
        align: 'center',
        render: (text, h) => (
          <span>
            {
              <React.Fragment>
                <a href="javascript:;" onClick={() => this.toDial(h)}>
                  <div className={styles.send}>
                    <Icon type="phone" />
                    拨打电话
                  </div>
                </a>
                <a href="javascript:;">
                  <div className={styles.send}>
                    <Icon type="mail"/>
                    <Dropdown overlay={menu} trigger={['click']}>
                      <span>
                        发送短信 <Icon type="down" onClick={() => this.getFamilyData(h)} />
                      </span>
                    </Dropdown>
                  </div>
                </a>
                <div className={styles.marketing}>
                  <a href="javascript:;" onClick={() => this.OpenPhoneDetail(h)}>
                      电话明细
                  </a>
                  <a href="javascript:;" onClick={() => this.OpenSmsDetail(h)}>
                      短信明细
                  </a>
                  <a href="javascript:;" onClick={() => this.OpenRemark(h)}>
                      备注
                  </a>
                </div>
              </React.Fragment>
            }
          </span>
        ),
      },
    ];
    const menu = (
      <Menu>
        {priceTempList}
      </Menu>
    );
    const phonecolumns: any = [
      {
        title: '订单号',
        dataIndex: 'OrderId',
        width: 100,
        align: 'center',
      },
      {
        title: '父母',
        dataIndex: 'Father',
        align: 'center',
        render: (text,h) => {
          return `${h.Father}/${h.Mother}`
        },
      },
      {
        title: '手机号码',
        dataIndex: 'Mobile',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'LastStatus',
        align: 'center',
        render: (text, h) => {
          return stateMap[h.LastStatus]
        },
      },
      {
        title: '拨打时间',
        dataIndex: 'LastCallTime',
        align: 'center',
      },
      {
        title: '通话时长',
        align: 'center',
        render: (text,h) =>{
          return <span>{this.formatSeconds(h.LastCallSecond)}</span>
        }
      }
    ];
    const smscolumns: any = [
      {
        title: '订单号',
        dataIndex: 'OrderId',
        width: 100,
        align: 'center',
      },
      {
        title: '父母',
        dataIndex: 'Father',
        align: 'center',
        render: (text,h) => {
          return `${h.Father}/${h.Mother}`
        },
      },
      {
        title: '手机号码',
        dataIndex: 'Mobile',
        align: 'center',
      },
      {
        title: '内容',
        dataIndex: 'ContentTemplateName',
        align: 'center',
        render: (text, h) => {
          return (
            <Tooltip placement="topLeft" title={h.ContentTemplateName} arrowPointAtCenter>
              <span>
                {h.ContentTemplateName}
                <Icon type="question-circle" />
              </span>
            </Tooltip>
          )
        },
      },
      {
        title: '状态',
        dataIndex: 'LastStatus',
        align: 'center',
        render: (text,h) => {
          return stateSmsMap[h.LastStatus]
        },
      },
      {
        title: '发送时间',
        dataIndex: 'LastCallTime',
        align: 'center',
      }
    ];
    return (
      <div className={styles.main} ref={obj => (this.divForm = obj)}>
        <div className={styles.condition}>
          <Input2
            placeholder="父/母搜索"
            value={parent}
            onChange={this.onParentChanged}
            className={styles.searchInput}
          />
          <Input2 placeholder="手机号搜索" value={mobile} className={styles.searchInput} onChange={this.onMobileChanged} />
          <div className={styles.title}>时间范围：</div>
          <DatePicker.RangePicker onChange={this.onDateChanged} value={timeRange} />
          <Button ghost type="primary" className={styles.btn} onClick={this.onSelect}>
            搜索
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          pagination={false}
          scroll={{ y: height }}
          rowKey="FamilyId"
          bordered={true}
          locale={{
            emptyText: '暂无记录',
          }}
        />
        <SplitPage
          pageIndex={pageindex}
          total={totalCount}
          pageSize={pagecount}
          onPageChanged={this.onPageChanged}
        />

        {isShowDetail && (
          <ShortMessageSendConfirm
            onClose={this.onCloseDetail}
            data={orderDetail}
            doType="detail"
          />
        )}
        {/* 电话明细 */}
          <Modal title={`电话明细-${this.state.phoneInfo}`} visible= {this.state.phonevisible}
          style={{ top: 100}}
          width='720px'
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={()=>this.handleCancel()}>关闭</Button>,
          ]}
          >
          <Table
            columns={phonecolumns}
            dataSource={phoneList}
            pagination={false}
            scroll={{ y: height }}
            rowKey='LastCallTime            '
            locale={{
              emptyText: '暂无记录',
            }}
          />
          </Modal>
        {/* 短信明细 */}
          <Modal title={`短信明细-${this.state.smsInfo}`} visible= {this.state.smsvisible}
          style={{ top: 100}}
          width='720px'
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={()=>this.handleCancel()}>关闭</Button>,
          ]}
          >
          <Table
            columns={smscolumns}
            dataSource={smsList}
            pagination={false}
            scroll={{ y: height }}
            locale={{
              emptyText: '暂无记录',
            }}
          />
          </Modal>
          {/* 短信发送 */}
          {isShowTemplateD && (
          <Modal title="短信发送" visible={this.state.isShowTempTab}
            style={{ top: 100 }}
            width='720px'
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" size="large" onClick={() => this.handleCancel()}>关闭</Button>,
              <Button key="submit" type="primary" size="large" onClick={() => this.onSend()}>发送</Button>


            ]}
          >
            <Table
              className={styles.tableContent}
              columns={columnsTemp}
              dataSource={templateList}
              pagination={false}
              scroll={{ y: height }}
              rowClassName = {(record,index)=> record.TemplateSysId == this.state.templateid?styles.checkedTab:''}
              rowKey="TemplateSysId"
              bordered={true}
              locale={{
                emptyText: '暂无记录',
              }}
            />
          </Modal>
        )}
          {/* 拨打电话弹窗 */}
          {isShowCall && (
            <CallTelephone
              onchangeD = {this.onchangeD}
              data={seatList}
              phoneData={CallData}
              onClose = {this.onCloseMobile}
            />
          )}
          {/* 备注 */}
          {isShowRemark && (
          <Modal title="备注" visible= {this.state.remarkvisible}
          style={{ top: 100}}
          width='720px'
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" size="large" onClick={()=>this.submitRemark()}>
              保存
            </Button>,
            <Button key="back" type="primary" size="large" onClick={()=>this.handleCancel()}>关闭</Button>
            
          ]}
          >
          <div className={styles.topBox}>
            <span className={styles.topSpan}>{currData!==null?`父母:${currData.Father}/${currData.Mother}`:''}</span>
            <span className={styles.topSpan}>{currData!==null?`手机号码:${currData.Mobile}`:''}</span>
            <span className={styles.topSpan}>{currData!==null?`最后修改时间:${currData.RemarkLastUpdateTime}`:''}</span>
          </div>
          <div className={styles.textareaBox}>
            <textarea onChange={this.changeRemark} value={(currData !=null && currData.Remark !=null) ?currData.Remark:''} className={styles.textarea} placeholder="点击此处开始编辑备注"></textarea>
          </div>
          </Modal>
        )
        }
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
