import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, Divider, Icon, Tooltip,Modal,Select, Form, Input} from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';
import { DelegateTemplateEdit } from 'components/delegateTemplateEdit';
import { confirm } from 'components/confirm';
import { FormItem } from 'components/formItem';
import { Input2 } from 'components/input';
import { TextArea2 } from 'components/textArea';
import router from 'umi/router';

interface Props {
  dispatch: (props: any) => void;
  data: any;
}

interface State {
  height: number;
  typeValue:string;
  editvisible:boolean;
  temvisible:boolean;
  remarkvisible:boolean; 
  defaultSignName:string;
  editSignId:string;
  edittemplateid:string;
  templateName:string;
  Id:string;
}

class Component extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      typeValue:'0',
      templateName:'',
      height: 0,
      Id:'',
      editvisible:false,
      remarkvisible:false,
      temvisible:false,
      defaultSignName:'',
      editSignId:'',
      edittemplateid:''
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
      temvisible:false,
      remarkvisible:false,
      defaultSignName:''
    });
  }
  onChangeTName = (e)=>{
    this.setState({
      templateName: e.target.value,
    });
  }
  onOpenMEdit = record => {
    router.push({
      pathname: `/commissionMarket/customerList`,
      query:{
        Id:record.Id
      }
    })
  };
  onOpenTEdit = record => {
    this.setState({
      remarkvisible:true,
      Id:record.Id
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
  onDelegateNameChanged = e => {
    this.props.dispatch({
      type: `${namespace}/ondelegateNameChanged`,
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
  saveRemark = ()=>{
    this.props.dispatch({
      type: `${namespace}/changeRemark`,
      payload: {
        Id:this.state.Id,
        Remark:this.props.data.currData.Remark != null?this.props.data.currData.Remark:''
      },
    });
  }
  handleChange = value =>{
    this.setState({
      editSignId:value,
    })
  }
  // 修改模板名称
  saveTemplate = (container) =>{
    this.props.dispatch({
      type: `${namespace}/onEditTem`,
      payload: {
        container,
        templateid:this.state.edittemplateid,
        templatename:this.state.templateName
      },
    });
    this.setState({
      temvisible : false
    })
  }
  saveSign = (container) =>{
    this.props.dispatch({
      type: `${namespace}/onEdit`,
      payload: {
        container,
        templateid:this.state.edittemplateid,
        signid:this.state.editSignId
      },
    });
    this.setState({
      editvisible : false
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
  toPause = record =>{
    confirm({
      title: `您确定将该用户的状态从
      [${record.ExamineStateName}]变为[暂停委托]吗？`,
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/changeStatus`,
          payload:{
            Id:record.Id,
            Status:3
          }
        });
      },
    });
  }
  toStop = record =>{
    confirm({
      title: `您确定将该用户的状态从
      [${record.ExamineStateName}]变为[停止委托]吗？`,
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/changeStatus`,
          payload:{
            Id:record.Id,
            Status:4
          }
        });
      },
    });
  }
  toCancel = record =>{
    confirm({
      title: `您确定将该用户的状态从
      [${record.ExamineStateName}]变为[取消委托]吗？`,
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/changeStatus`,
          payload:{
            Id:record.Id,
            Status:4
          }
        });
      },
    });
  }
  toRecover = record =>{
    confirm({
      title: `您确定将该用户的状态从
      [${record.ExamineStateName}]变为[恢复委托]吗？`,
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/changeStatus`,
          payload:{
            Id:record.Id,
            Status:2
          }
        });
      },
    });
  }
  toRenew = record =>{
    confirm({
      title: `您确定将该用户的状态从
      [${record.ExamineStateName}]变为[重新委托]吗？`,
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/changeStatus`,
          payload:{
            Id:record.Id,
            Status:1
          }
        });
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
  oncontentChanged = (e) =>{
    this.props.dispatch({
      type: `${namespace}/onRemarkChanged`,
      payload: e.target.value,
    });
  }
  // 打开委托详情
  onOpenDetails = (h) =>{
    router.push({
      pathname: `/commissionMarket/commissionDetail`,
      query:{
        Id:h.Id
      }
    })
  }
  render() {
    const { list, typelist, totalCount, pageindex, pagecount, isShowEdit,isShowSign, currData,delegateName,delegateStatus,isShowRemark,Remark } = this.props.data;
    const { height } = this.state;
    const columns: any = [
      {
        title: '活动名称',
        dataIndex: 'Name',
        width: '10%',
        align: 'center',
      },
      {
        title: '委托状态',
        dataIndex: 'Status',
        width: '8%',
        align: 'center',
        render: (text, h) => {
          const red = h.Status === 6  ;
          return <span style={{ color: red ? 'red' : '' }}>{h.ExamineStateName}</span>;
        },
      },
      {
        title: '委托描述',
        dataIndex: 'Description',
        width: '10%',
        align: 'center',
      },
      {
        title: '委托数量',
        dataIndex: 'DelegateCount',
        width: '6%',
        align: 'center',
      },
      {
        title: '活动时间',
        dataIndex: 'CreateTime',
        width: '10%',
        align: 'center',
        render: (text, h) => {
            return <span>{h.StartTime}至{h.EndTime}</span>;
        },
      },
      {
        title: '操作',
        key: 'action',
        width: '36%',
        align: 'center',
        render: (text, h) => (
          <span>
              <React.Fragment>
                <a href="javascript:;" onClick={() => this.onOpenDetails(h)}>
                  委托详情
                </a>
                <Divider type="vertical" />
              </React.Fragment>
              <React.Fragment>
              <a href="javascript:;" onClick={() => this.onOpenMEdit(h)}>
                客户名单
              </a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.onOpenTEdit(h)}>
                备注
              </a>
              </React.Fragment>
              <Divider type="vertical" />
              {h.Status == 1 && (
                <Button ghost type="primary" className={styles.tabBtn} onClick={() =>this.toCancel(h)}>
                  取消委托
                </Button>
              )}
              {h.Status == 2 && (
                <Button ghost type="primary" className={styles.tabBtn} onClick={() =>this.toPause(h)}>
                  暂停委托
                </Button>
              )}
              {(h.Status == 2 || h.Status == 3) && (
                <Button ghost type="primary" className={styles.tabBtn} onClick={() => this.toStop(h)}>
                  停止委托
                </Button>
              )}
              {(h.Status == 3) && (
                <Button ghost type="primary" className={styles.tabBtn} onClick={() => this.toRecover(h)}>
                  恢复委托
                </Button>
              )}
              {(h.Status == 6) && (
                <Button ghost type="primary" className={styles.tabBtn} onClick={() => this.toRenew(h)}>
                  重新委托
                </Button>
              )}
              <a href="javascript:;" onClick={() => this.onOpenEdit(h)}>
                编辑
              </a>
              <Divider type="vertical" />
              {(h.Status == 6 || h.Status == 1) && (
                <a href="javascript:;" onClick={() => this.onDelete(h)} style={{ color: 'red' }}>
                  删除
                </a>
              )}
          </span>
        ),
      },
    ];

    const statusMap = {
      1: '申请委托中',
      2: '委托中',
      3: '暂停委托',
      4: '停止委托',
      5: '委托完成',
      6: '委托失败',
      7: '管理员作废',
    };

    const listData = list.map(h => ({
      ...h,
      ExamineStateName: statusMap[h.Status],
    }));
    return (
      <div className={styles.main} ref={obj => (this.divForm = obj)}>
          <div className={styles.condition}>
          <Input2
            placeholder="活动名称"
            value={delegateName}
            className={styles.searchInput}
            onChange={this.onDelegateNameChanged}
          />
          <label htmlFor="">状态：</label>
          <Select
            placeholder="委托状态"
            defaultValue = '0'
            className={styles.age}
            onSelect={this.onChangeTemplate}
            style={{ width: 190 }}
          > 
            <Select.Option value='0'>全部</Select.Option>
            <Select.Option value='1'>申请委托中</Select.Option>
            <Select.Option value='2'>委托中</Select.Option>
            <Select.Option value='3'>暂停委托</Select.Option>
            <Select.Option value='4'>停止委托</Select.Option>
            <Select.Option value='5'>委托完成</Select.Option>
            <Select.Option value='6'>委托失败</Select.Option>
          </Select>
          <Button ghost type="primary" className={styles.btn} onClick={this.onSelect}>
            搜索
          </Button>
          <Button
            className={styles.btnAdd}
            ghost
            type="primary"
            onClick={() => this.onOpenEdit(null)}
          >
            添加
          </Button>
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
        <Modal title="修改签名" visible={this.state.editvisible}
          style={{ top: 200}}
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
            <span>签名：</span>
              <Select value={this.state.defaultSignName} style={{ width: 300 }} onChange={this.handleChange} >
                {/* {typelist.map((item,index) =>(
                  <Select.Option key={item.SignId} value={item.SignId}>{item.SignName}</Select.Option>
                ))} */}
              </Select>
          </Form>
        </div>
        </Modal>
        {/* 备注 */}
        {isShowRemark && (<Modal title="备注" visible={this.state.remarkvisible}
          style={{ top: 200}}
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
            <TextArea2
              placeholder="请输入活动内容"
              value={(currData != null && currData.Remark != null)?currData.Remark:''}
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