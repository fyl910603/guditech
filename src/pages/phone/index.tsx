import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button, Modal,Divider, Table,Tooltip,Icon,Input,message} from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { PictureShow } from 'components/pictureShow';
import { LicenseShow } from 'components/licenseShow';
import { PictureUpload } from 'components/pictureUpload';
import { namespace } from './model';
import { SmsTemplateEdit } from 'components/SmsTemplateEdit';
import { confirm } from 'components/confirm';
import { LinkButton } from 'components/linkButton';
import { MessageBox } from 'components/messageBox';

interface State {
  status :number,
  channelcode : string,
  editvisible : boolean,
  addvisible :boolean,
  imgvisible :boolean,
  currData : object,
  editImgUrl: string,
  addData : object,
  addSignName: any,
  addImgUrl:string,
  lookImg:string,
  Path:string
}
interface Props {
  dispatch: (props: any) => void;
  data: any
}
let divForm: HTMLDivElement;
class Component extends React.PureComponent<Props,State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      status : 0,
      channelcode:'',
      editvisible:false,
      addvisible:false,
      imgvisible:false,
      currData:{},
      addData:{
        MobileCount:'',
        PhoneCount:'',
        SeatCount:''
      },
      editImgUrl : '',
      addImgUrl : '',
      lookImg:'',
      Path:'',
      addSignName : ''
    };
    this.getSignList()
  }
  componentDidMount() {
  }

  componentWillUnmount() {
  }
  
  getSignList = () =>{
    this.props.dispatch({
      type: `${namespace}/fetchSign`,
      payload: {
        status: this.state.status,
        channelcode: this.state.channelcode,
      },
    });
  }
  onSave = (data, container) => {
    this.props.dispatch({
      type: `${namespace}/onSave`,
      payload: {
        container,
        data,
      },
    });
  };
   onSubmit = (e)=>{
     console.log()
    //   this.props.dispatch({
    //   type: `${namespace}/save`,
    //   payload: {
    //     SignId: this.state.addData.SignId,
    //     editSignName: this.state.currData.SignName,
    //     editImgUrl:this.state.Path
    //   },
    // });
      e.preventDefault();
      // this.setState({
      //   editvisible: false,
      // });
    }
    addSave = (e)=>{
      this.props.dispatch({
      type: `${namespace}/add`,
      payload: {
        TelephoneCount: this.state.addData.PhoneCount,
        MobileCount: this.state.addData.MobileCount,
        SeatCount: this.state.addData.SeatCount,
        Licencel:this.state.Path
      },
    });
      e.preventDefault();
      this.setState({
        editvisible: false,
      });
    }
  handleCancel = (e) => {
    this.setState({
      editvisible: false,
      addvisible: false,
      imgvisible:false,
    });
  }
  onCloseEdit = () => {
    this.props.dispatch({
      type: `${namespace}/showEdit`,
      payload: {
        isShowEdit: false,
      },
    });
  };
  onOpenEdit = record => {
    this.setState({
      currData:record
    })
    setTimeout(()=>{
      this.setState({
        editvisible:true,
        editImgUrl:record.LicenceUrl
      })
    },50)
  };
  onOpenAdd = ()=> {
      this.setState({
        addvisible:true,
      })
  };
  onOpenImg = (img)=> {
    this.setState({
      editvisible: false,
      addvisible: false,
    })
    setTimeout(()=>{
      this.setState(
        {
          imgvisible:true,
          lookImg:img
         
        }
      )
    },20)
  };
  onDelete = record => {
    confirm({
      title: '确定要删除该模板吗？',
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/onDelete`,
          payload: record.Id,
        });
      },
    });
  };
   onMobileCountChanged =(e)=>{
      this.setState({
        addData:Object.assign(this.state.addData,{MobileCount:e.target.value})
      })
    }
    onPhoneCountChanged =(e)=>{
      this.setState({
        addData:Object.assign(this.state.addData,{PhoneCount:e.target.value})
      })
    }
    onSeatCountChanged =(e)=>{
      this.setState({
        addData:Object.assign(this.state.addData,{SeatCount:e.target.value})
      })
    }
    onaddSignnameChanged =(e)=>{
      this.setState({
        addSignName:e.target.value
      })
    }
    picUpload = (data)=>{
        this.setState({
          currData:Object.assign(this.state.currData,{LicenceUrl:data.ImgUrl}),
          Path:data.ImgPath
        })
        setTimeout(()=>{
          this.setState({
            editImgUrl:data.ImgUrl,
            addImgUrl:data.ImgUrl
          })
        },50)
        // dispatch({
        //   type: `${namespace}/picUpload`,
        //   payload: data,
        // });
      }
    
    onPicUploadError = (error)=>{
        MessageBox.show(error, divForm);
      }
      // const { lastData, currData, isShowLastInfo, isShowEdit } = this.props.data;
    
      // const canSave = currData.Status === undefined || currData.Status === 1 || currData.Status === 4;
    
    onOpenLastInfo =()=>{
        // dispatch({
        //   type: `${namespace}/showLastInfo`,
        //   payload: true,
        // });
      }
    onCloseLastInfo = ()=>{
        // dispatch({
        //   type: `${namespace}/showLastInfo`,
        //   payload: false,
        // });
      }
  render() {
    const columns: any = [
      {
        title: '网络电话号码数量',
        dataIndex: 'MobileCount',
        width: 150,
        align:'center'
      },
      {
        title: '网络电话席位数量',
        dataIndex: 'SeatCount',
        width: 150,
        align:'center'
      },
      {
        title: '座机电话数量',
        dataIndex: 'TelephoneCount',
        width: 150,
        align:'center'
      },
      {
        title: '营业执照',
        dataIndex: 'LicenceUrl',
        width: 150,
        align:'center',
        render: (text, record) => {
          return (
            <span>
              <span className={styles.textBtn1} onClick={()=>this.onOpenImg(record.LicenceUrl)}>查 看</span>
            </span>
          )
        }
      },
      {
        title: '审核状态',
        width: 150,
        dataIndex: 'ExamineStateName',
        align:'center',
        render: (text, h) => {
          const red = h.Status === 4 || h.Status === 3;
          if (h.Status === 4 || h.Status === 3) {
            return (
              <Tooltip placement="topLeft" title={h.StatusDes} arrowPointAtCenter>
                <span style={{ color: red ? 'red' : '' }}>
                  {h.ExamineStateName}
                  <Icon type="question-circle" />
                </span>
              </Tooltip>
            );
          } else {
            return <span style={{ color: red ? 'red' : '' }}>{h.ExamineStateName}</span>;
          }
        },
      },
      {
        title: '申请时间',
        dataIndex: 'CreateTime',
        width: 280,
        align:'center'
      },
      {
        title: '更新时间',
        dataIndex: 'UpdateTime',
        width: 280,
        align:'center'
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        align:'center',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.onOpenEdit(record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.onDelete(record)} style={{ color: 'red' }}>
              删除
            </a>
          </span>
        ),
      },
    ];
    const statusMap = {
      0: '待审核',
      1: '审核中',
      2: '审核通过',
      3: '审核失败',
      4: '管理员作废',
    };
    const {phoneData,signList, isShowEdit, currData} = this.props.data
    const canSave = currData.Status === undefined || currData.Status === 1 || currData.Status === 4;
    
    if(phoneData.List && phoneData.List.length>0){
      var table;
      const listData = phoneData.List.map(h => ({
        ...h,
        ExamineStateName: statusMap[h.Status],
      }));
      table = <Table
        columns={columns}
        dataSource={listData}
        pagination={false}
        // scroll={{ y: height }}
        bordered={true}
        rowKey="Id"
        locale={{
          emptyText: '暂无客户数据',
        }}
      />
    }
    

    return (
      <div className={styles.page} >
        <div className={styles.hintBox}>
          <span className={styles.hint}>您可以与客户建立更直接、精准的语音沟通，大大降低拓客成本.点击此处</span><span className={styles.textBtn} onClick={()=>{this.onOpenAdd()}}>申请电话业务</span>
        </div>
        <div className={styles.divTable}>
          {table}
        </div>
        {/* <SplitPage
          pageIndex={pageindex}
          total={totalCount}
          pageSize={pagecount}
          onPageChanged={this.onPageChanged}
        /> */}
        {/* 编辑短信业务 */}
        <Modal title="编辑短信业务" visible={this.state.editvisible}
          style={{ top: 200}}
          width='630px'
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.onSubmit}>
              提交
            </Button>,
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          ]}
        >
          <div className={styles.form}>
           <Form>
             <FormItem title="签名：" thWidth={120}>
              <Input
                onChange={this.onSignnameChanged}
                defaultValue={this.state.currData.SignName}
                maxLength={12}
                placeholder="请输入签名信息"
              />
            </FormItem>
            <FormItem title="营业执照：">
              <div className={styles.picItem}>
                <PictureShow type={2} url={this.state.editImgUrl} />
                <PictureUpload
                  onSuccess={this.picUpload}
                  onError={this.onPicUploadError}
                  type={2}
                  title="上传营业执照"
                />
              </div>
            </FormItem>
            <FormItem>
            </FormItem>
          </Form>
        </div>
        </Modal>
        {/* 新增短信业务 */}
        <Modal title="申请电话业务" visible={this.state.addvisible}
          style={{ top: 200}}
          width='630px'
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.addSave}>
              提交
            </Button>,
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          ]}
        >
          <div className={styles.form}>
           <Form>
             <FormItem title="网络电话号码数量：" isRequire thWidth={120}>
              <Input
                onChange={this.onMobileCountChanged}
                defaultValue={this.state.addData.MobileCount}
                maxLength={12}
                placeholder="请输入网络电话号码数量"
              />
            </FormItem>
            <FormItem title="座机电话数量：" isRequire thWidth={120}>
              <Input
                onChange={this.onPhoneCountChanged}
                defaultValue={this.state.addData.PhoneCount}
                maxLength={12}
                placeholder="请输入座机电话数量"
              />
            </FormItem>
            <FormItem title="坐席数量：" isRequire thWidth={120}>
              <Input
                onChange={this.onSeatCountChanged}
                defaultValue={this.state.addData.SeatCount}
                maxLength={12}
                placeholder="请输入坐席数量"
              />
            </FormItem>
            <FormItem title="营业执照：">
              <div className={styles.picItem}>
                <PictureShow type={2} url={this.state.addImgUrl} />
                <PictureUpload
                  onSuccess={this.picUpload}
                  onError={this.onPicUploadError}
                  type={2}
                  title="上传营业执照"
                />
              </div>
            </FormItem>
            <FormItem>
            </FormItem>
          </Form>
        </div>
        </Modal>
        <Modal title="查看营业执照" visible={this.state.imgvisible}
          style={{ top: 100}}
          width='630px'
          onCancel={this.handleCancel}
          footer={null}
          >
          <LicenseShow type={1} url={this.state.lookImg} />
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