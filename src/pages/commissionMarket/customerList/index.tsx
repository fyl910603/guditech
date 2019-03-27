import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, Divider, Icon, Tooltip, Modal, Select, Form, Input, DatePicker } from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';
import { DelegateTemplateEdit } from 'components/delegateTemplateEdit';
import { confirm } from 'components/confirm';
import { FormItem } from 'components/formItem';
import { Input2 } from 'components/input';
import { TextArea2 } from 'components/textArea';
import router from 'umi/router';
import {exportExcel} from 'xlsx-oc'

interface Props {
  dispatch: (props: any) => void;
  data: any;
}

interface State {
  height: number;
  typeValue: string;
  editvisible: boolean;
  temvisible: boolean;
  remarkvisible: boolean;
  confirmvisible: boolean;
  appointvisible: boolean;
  defaultSignName: string;
  editSignId: string;
  edittemplateid: string;
  templateName: string;
  Id: string;
}

class Component extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      typeValue: '0',
      templateName: '',
      height: 0,
      Id: '',
      editvisible: false,
      appointvisible: false,
      confirmvisible:false,
      remarkvisible: false,
      temvisible: false,
      defaultSignName: '',
      editSignId: '',
      edittemplateid: ''
    };
  }

  componentDidMount() {
    // this.props.dispatch({
    //   type: `${namespace}/fetch`,
    //   payload: {
    //     container: this.divForm,
    //   },
    // });
    //   this.props.dispatch({
    //     type: `${namespace}/fetchType`,
    //     payload: {
    //       container: this.divForm,
    //       status: 1,
    //     },
    //   });
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    // this.props.dispatch({
    //   type: `${namespace}/fetch`,
    //   payload: {
    //     container: this.divForm,
    //   },
    // });
    //   this.props.dispatch({
    //     type: `${namespace}/fetchType`,
    //     payload: {
    //       container: this.divForm,
    //       status: 1,
    //     },
    //   });
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.setState({
      height: this.divForm.offsetHeight - 55 - 80,
    });
  };
  handleCancel = (e) => {
    this.setState({
      editvisible: false,
      temvisible: false,
      remarkvisible: false,
      appointvisible:false,
      confirmvisible:false,
      defaultSignName: ''
    });
  }
  onChangeTName = (e) => {
    this.setState({
      templateName: e.target.value,
    });
  }
  onOpenMEdit = record => {
    this.setState({
      defaultSignName: record.SignId,
      edittemplateid: record.TemplateSysId,
      editSignId: record.SignId
    })
    setTimeout(() => {
      this.setState({
        editvisible: true,
      })
    }, 50)
  };
  onOpenTEdit = record => {
    this.setState({
      remarkvisible: true,
      Id: record.Id
    })
    this.props.dispatch({
      type: `${namespace}/showRemark`,
      payload: {
        currData: record,
        isShowRemark: true,
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
  // 客户姓名改变
  onCustomerNameChanged = e => {
    this.props.dispatch({
      type: `${namespace}/oncustomerNameChanged`,
      payload: e.target.value,
    });
  };
  // 客户电话改变
  onCustomerMobileChanged = e => {
    this.props.dispatch({
      type: `${namespace}/oncustomerMobileChanged`,
      payload: e.target.value,
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
  onOpenEdit = record => {
    this.props.dispatch({
      type: `${namespace}/showEdit`,
      payload: {
        currData: record,
        isShowEdit: true,
      },
    });
  };

  onCloseEdit = () => {
    this.props.dispatch({
      type: `${namespace}/showEdit`,
      payload: {
        isShowEdit: false,
      },
    });
  };

  onSave = (data, container) => {
    this.props.dispatch({
      type: `${namespace}/onSave`,
      payload: {
        container,
        data,
      },
    });
  };
  // 保存备注
  saveRemark = () => {
    this.props.dispatch({
      type: `${namespace}/changeRemark`,
      payload: {
        Id: this.state.Id,
        Remark: this.props.data.currData.Remark
      },
    });
  }
  handleChange = value => {
    this.setState({
      editSignId: value,
    })
  }
  // 修改模板名称
  saveTemplate = (container) => {
    this.props.dispatch({
      type: `${namespace}/onEditTem`,
      payload: {
        container,
        templateid: this.state.edittemplateid,
        templatename: this.state.templateName
      },
    });
    this.setState({
      temvisible: false
    })
  }
  saveSign = (container) => {
    this.props.dispatch({
      type: `${namespace}/onSaveAppoint`,
      payload: {
        container,
        Id:this.state.Id
      },
    });
    this.setState({
      editvisible: false
    })
  }
  saveConfirmToShop= (container) => {
    this.props.dispatch({
      type: `${namespace}/onSaveConfirm`,
      payload: {
        container,
        Id:this.state.Id
      },
    });
    this.setState({
      confirmvisible: false
    })
  }
  onDelete = record => {
    confirm({
      title: `确定要删除${record.Name}活动吗？`,
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/onDelete`,
          payload: record.Id,
        });
      },
    });
  };
  // 无效
  toVoid = record => {
    confirm({
      title: `您确定将该用户的状态从
      [${record.ExamineStateName}]变为[无效]吗？`,
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/changeStatus`,
          payload: {
            Id: record.Id,
            Status: 5,
            Time: '',
            Remark: ''
          }
        });
      },
    });
  }
  // 确认成交
  toDeal = record => {
    confirm({
      title: `您确定将该用户的状态从
      [${record.ExamineStateName}]变为[确认成交]吗？`,
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/changeStatus`,
          payload: {
            Id: record.Id,
            Status: 4,
            Time: '',
            Remark: ''
          }
        });
      },
    });
  }
  // 潜在客户
  onPotential = record => {
    confirm({
      title: `您确定将该用户的状态从
      [${record.ExamineStateName}]变为[潜在客户吗]吗？`,
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/changeStatus`,
          payload: {
            Id: record.Id,
            Status: 1,
            Time: '',
            Remark: ''
          }
        });
      },
    });
  }
  // 打开预约
  toOpenAppoint = record => {
    this.setState({
      appointvisible: true,
      Id: record.Id
    })
    this.props.dispatch({
      type: `${namespace}/showAppoint`,
      payload: {
        currData: record,
        isShowAppoint: true,
      },
    });
  }
  // 确认到店
  toArrive= record => {
    this.setState({
      confirmvisible: true,
      Id: record.Id
    })
    this.props.dispatch({
      type: `${namespace}/showConfirm`,
      payload: {
        currData: record,
        isShowConfirmToShop: true,
      },
    });
  }
  onChangeTemplate = (value) => {
    this.props.dispatch({
      type: `${namespace}/onStatusChanged`,
      payload: value,
    });
  }
  // 备注改变
  oncontentChanged = (e) => {
    this.props.dispatch({
      type: `${namespace}/onRemarkChanged`,
      payload: e.target.value,
    });
  }
  appointRemarkChanged = (e) =>{
    this.props.dispatch({
      type: `${namespace}/onAppointRemarkChanged`,
      payload: e.target.value,
    });
  }
  // 预约时间改变
  onDateChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onDateChanged`,
      payload: e,
    });
  };
  onOk = value =>{
    this.props.dispatch({
      type: `${namespace}/onDateChanged`,
      payload: value,
    });
  }
  // 打开委托详情
  onOpenDetails = (h) => {
    router.push({
      pathname: `/commissionMarket/${h.Id}`,
    })
  }
  // 导出excel表格
  exportDefaultExcel = (data) => {
    var _headers = [
    { k: 'ChildName', v: '孩子姓名' },
    { k: 'Mobile', v: '联系方式' },
    { k: 'ExamineStateName', v: '委托状态' }, 
    { k: 'AppointmentCount', v: '预约次数' },
    { k: 'AppointmentTime', v: '预约时间' }, 
    { k: 'ArriveTime', v: '到店日期' },
    ]
    exportExcel(_headers, data);
  }
  render() {
    const { list, typelist, totalCount, arrival, unbooked, pageindex, pagecount, isShowConfirmToShop,isShowEdit, isShowSign, currData, CustomerMobile, CustomerName, delegateStatus, isShowRemark, isShowAppoint, Remark, Time } = this.props.data;
    const { height } = this.state;
    const columns: any = [
      {
        title: '孩子姓名',
        dataIndex: 'ChildName',
        width: '10%',
        align: 'center',
      },
      {
        title: '联系方式',
        dataIndex: 'Mobile',
        width: '10%',
        align: 'center',
      },
      {
        title: '委托状态',
        dataIndex: 'Status',
        width: '8%',
        align: 'center',
        render: (text, h) => {
          const red = h.Status === 6;
          return <span style={{ color: red ? 'red' : '' }}>{h.ExamineStateName}</span>;
        },
      },
      {
        title: '预约次数',
        dataIndex: 'AppointmentCount',
        width: '10%',
        align: 'center',
      },
      {
        title: '预约日期',
        dataIndex: 'AppointmentTime',
        width: '9%',
        align: 'center',
      },
      {
        title: '到店日期',
        dataIndex: 'ArriveTime',
        width: '9%',
        align: 'center'
      },
      {
        title: '备注',
        dataIndex: 'SellerRemark',
        width: '8%',
        align: 'center',
        render: (text, h) => {
          return <span><React.Fragment>
            <a href="javascript:;" onClick={() => this.onOpenTEdit(h)}>
              (详情)
            </a>
          </React.Fragment></span>;
        },
      },
      {
        title: '操作',
        key: 'action',
        width: '36%',
        align: 'center',
        render: (text, h) => (
          <span>
            {(h.Status == 2 || h.Status == 3 || h.Status == 5) && (
              <Button ghost type="primary" className={styles.tabBtn} onClick={() => this.onPotential(h)}>
                潜在客户
                </Button>
            )}
            {(h.Status == 1 || h.Status == 2 || h.Status == 3) && (
              <Button ghost type="primary" className={styles.voidBtn} onClick={() => this.toVoid(h)}>
                无效
                </Button>
            )}
            {(h.Status == 2) && (
              <Button ghost type="primary" className={styles.appointBtn} onClick={() => this.toOpenAppoint(h)}>
                再次预约
                </Button>
            )}
            {(h.Status == 1) && (
              <Button ghost type="primary" className={styles.appointBtn} onClick={() => this.toOpenAppoint(h)}>
                预约
                </Button>
            )}
            {(h.Status == 2) && (
              <Button ghost type="primary" className={styles.tabBtn} onClick={() => this.toArrive(h)}>
                确认到店
                </Button>
            )}
            {(h.Status == 3) && (
              <Button ghost type="primary" className={styles.dealBtn} onClick={() => this.toDeal(h)}>
                确认成交
                </Button>
            )}
          </span>
        ),
      },
    ];

    const statusMap = {
      1: '潜在客户',
      2: '预约中',
      3: '确认到店',
      4: '确认成交',
      5: '无效',
    };

    const listData = list.map(h => ({
      ...h,
      ExamineStateName: statusMap[h.Status],
    }));
    return (
      <div className={styles.main} ref={obj => (this.divForm = obj)}>
        <div className={styles.condition}>
          <Input2
            placeholder="客户姓名:"
            value={CustomerName}
            className={styles.searchInput}
            onChange={this.onCustomerNameChanged}
          />
          <Input2
            placeholder="客户电话:"
            value={CustomerMobile}
            className={styles.searchInput}
            onChange={this.onCustomerMobileChanged}
          />
          <label htmlFor="">状态：</label>
          <Select
            placeholder="委托状态"
            defaultValue='0'
            className={styles.age}
            onSelect={this.onChangeTemplate}
            style={{ width: 190 }}
          >
            <Select.Option value='0'>全部</Select.Option>
            <Select.Option value='1'>潜在客户</Select.Option>
            <Select.Option value='2'>预约中</Select.Option>
            <Select.Option value='3'>确认到店</Select.Option>
            <Select.Option value='4'>确认成交</Select.Option>
            <Select.Option value='5'>无效</Select.Option>
          </Select>
          <Button ghost type="primary" className={styles.btn} onClick={this.onSelect}>
            搜索
          </Button>
          <Button
            className={styles.btnAdd}
            ghost
            type="primary"
            onClick={() => this.exportDefaultExcel(listData)}
          >
            导出
        </Button>
        </div>
        <div>
          <p><span>总数：{totalCount}人&nbsp;&nbsp;</span><span>未预约：{unbooked}人&nbsp;&nbsp;</span><span>已到店：{arrival}人</span></p>
        </div>
        <Table
          columns={columns}
          dataSource={listData}
          pagination={false}
          scroll={{ y: height }}
          rowKey="Id"
          bordered={true}
          locale={{
            emptyText: '暂无委托列表，请先去添加',
          }}
        />
        <SplitPage
          pageIndex={pageindex}
          total={totalCount}
          pageSize={pagecount}
          onPageChanged={this.onPageChanged}
        />

        {isShowEdit && (
          <DelegateTemplateEdit
            isEdit={true}
            data={currData}
            onSave={this.onSave}
            onClose={this.onCloseEdit}
          />
        )}
        {isShowConfirmToShop && (
          <Modal title={`确认到店-${currData.ChildName != undefined ? currData.ChildName : ''}`} visible={this.state.confirmvisible}
            style={{ top: 200 }}
            width='630px'
            onCancel={this.handleCancel}
            footer={[
              <Button key="submit" type="primary" size="large" onClick={this.saveConfirmToShop}>
                提交
                    </Button>,
              <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            ]}
          >
            <div className={styles.form}>
              <Form>
                <span>到店时间：</span>
                <DatePicker
                  showTime
                  value={Time}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="到店时间"
                  onChange={this.onDateChanged}
                  onOk={this.onOk}
                />
                <p>我的备注</p>
                <TextArea2
                  placeholder=""
                  value={currData.SellerRemark}
                  onChange={this.appointRemarkChanged}
                  maxLength={128}
                  // showFontCount={true}
                  className={styles.textarea}
                  disabled={false}
                />
              </Form>
            </div>
          </Modal>
        )}
        {isShowAppoint && (
          <Modal title={`预约-${currData.ChildName != null ? currData.ChildName : ''}`} visible={this.state.appointvisible}
            style={{ top: 200 }}
            width='630px'
            onCancel={this.handleCancel}
            footer={[
              <Button key="submit" type="primary" size="large" onClick={this.saveSign}>
                提交
                    </Button>,
              <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            ]}
          >
            <div className={styles.form}>
              <Form>
                <span>预约时间：</span>
                <DatePicker
                  showTime
                  value={Time}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="预约时间"
                  onChange={this.onDateChanged}
                  onOk={this.onOk}
                />
                <p>我的备注</p>
                <TextArea2
                  placeholder=""
                  value={currData.SellerRemark}
                  onChange={this.appointRemarkChanged}
                  maxLength={128}
                  // showFontCount={true}
                  className={styles.textarea}
                  disabled={false}
                />
              </Form>
            </div>
          </Modal>
        )}
        {/* 备注 */}
        {isShowRemark && (<Modal title={`备注-${currData.ChildName}`} visible={this.state.remarkvisible}
          style={{ top: 200 }}
          width='630px'
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.saveRemark}>
              提交
            </Button>,
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          ]}
        >
          <div className={styles.form}>
            <p>意向备注</p>
            <TextArea2
              placeholder=""
              value={currData.SellerRemark}
              // onChange={this.oncontentChanged}
              maxLength={128}
              // showFontCount={true}
              className={styles.textarea}
              disabled={true}
            />
            <p>我的备注</p>
            <TextArea2
              placeholder="请输入备注"
              value={currData.Remark}
              onChange={this.oncontentChanged}
              maxLength={128}
              // showFontCount={true}
              className={styles.textarea}
              disabled={false}
            />
          </div>
        </Modal>)
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