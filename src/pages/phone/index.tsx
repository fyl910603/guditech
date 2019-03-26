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
  Id : string,
  editvisible : boolean,
  addvisible :boolean,
  imgvisible :boolean,
  currData : object,
  editImgUrl: string,
  addData : object,
  editData : object,
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
      editData:{
        MobileCount:'',
        PhoneCount:'',
        SeatCount:''
      },
      Id:'',
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
        container:divForm,
        data,
      },
    });
  };
   onSubmit = (e,container)=>{
    if(this.props.data.PhoneCount == '' || this.props.data.MobileCount == '' || this.props.data.SeatCount == ''){
      if(this.props.data.MobileCount == ''){
        MessageBox.show('请输入网络电话数量', divForm);
        return false;
      }else if(this.props.data.PhoneCount == ''){
        MessageBox.show('请输入座机数量', divForm);
        return false;
      }else if(this.props.data.SeatCount == ''){
        MessageBox.show('请输入坐席数量', divForm);
        return false;
      }
    }else{
      this.props.dispatch({
        type: `${namespace}/editApply`,
        payload: {
          Id:this.state.Id,
          TelephoneCount: this.props.data.PhoneCount,
          MobileCount: this.props.data.MobileCount,
          SeatCount: this.props.data.SeatCount,
          Licencel:this.state.Path,
          container: divForm,
        },
      });
        e.preventDefault();
        this.setState({
          editvisible: false,
        });
    }
    }
    addSave = (e)=>{
      if(this.props.data.PhoneCount == '' || this.props.data.MobileCount == '' || this.props.data.SeatCount == '' || this.state.Path == ''){
        if(this.props.data.MobileCount == ''){
          MessageBox.show('请输入网络电话数量', divForm);
          return false;
        }else if(this.props.data.PhoneCount == ''){
          MessageBox.show('请输入座机数量', divForm);
          return false;
        }else if(this.props.data.SeatCount == ''){
          MessageBox.show('请输入坐席数量', divForm);
          return false;
        }else{
          MessageBox.show('请上传营业执照', divForm);
          return false;
        }
      }else{
        this.props.dispatch({
          type: `${namespace}/addApply`,
          payload: {
            TelephoneCount: this.props.data.PhoneCount,
            MobileCount: this.props.data.MobileCount,
            SeatCount: this.props.data.SeatCount,
            Licencel:this.state.Path
          },
        });
          e.preventDefault();
          this.setState({
            editvisible: false,
          });
      }
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
    this.props.dispatch({
      type: `${namespace}/MobileCountChanged`,
      payload: record.MobileCount,
    });
    this.props.dispatch({
      type: `${namespace}/PhoneCountChanged`,
      payload: record.SeatCount,
    });
    this.props.dispatch({
      type: `${namespace}/SeatCountChanged`,
      payload: record.TelephoneCount,
    });
    this.setState({
      currData:record
    })
    setTimeout(()=>{
      this.setState({
        editvisible:true,
        Id:record.Id,
        editImgUrl:record.LicenceUrl,
      })
    },50)
  };
  onOpenAdd = ()=> {
      let _this = this
      this.props.dispatch({
        type: `${namespace}/MobileCountChanged`,
        payload: '',
      });
      this.props.dispatch({
        type: `${namespace}/PhoneCountChanged`,
        payload: '',
      });
      this.props.dispatch({
        type: `${namespace}/SeatCountChanged`,
        payload: '',
      });
      setTimeout(()=>{
        _this.setState({
          addvisible:true,
          Path:''
        })
      },50)
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
    this.props.dispatch({
      type: `${namespace}/MobileCountChanged`,
      payload: e.target.value,
    });
    }
    onPhoneCountChanged =(e)=>{
      this.props.dispatch({
        type: `${namespace}/PhoneCountChanged`,
        payload: e.target.value,
      });
    }
    onSeatCountChanged =(e)=>{
      this.props.dispatch({
        type: `${namespace}/SeatCountChanged`,
        payload: e.target.value,
      });
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
    const {MobileCount,PhoneCount,SeatCount} = this.props.data
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
      <div className={styles.page} ref={obj => (divForm = obj)}>
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
           <FormItem title="网络电话号码数量：" isRequire thWidth={120}>
              <Input
                onChange={this.onMobileCountChanged}
                defaultValue={MobileCount}
                maxLength={12}
                placeholder="请输入网络电话号码数量"
              />
            </FormItem>
            <FormItem title="座机电话数量：" isRequire thWidth={120}>
              <Input
                onChange={this.onPhoneCountChanged}
                defaultValue={PhoneCount}
                maxLength={12}
                placeholder="请输入座机电话数量"
              />
            </FormItem>
            <FormItem title="坐席数量：" isRequire thWidth={120}>
              <Input
                onChange={this.onSeatCountChanged}
                defaultValue={SeatCount}
                maxLength={12}
                placeholder="请输入坐席数量"
              />
            </FormItem>
            <FormItem title="营业执照：" isRequire>
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
                value={MobileCount}
                maxLength={12}
                placeholder="请输入网络电话号码数量"
              />
            </FormItem>
            <FormItem title="座机电话数量：" isRequire thWidth={120}>
              <Input
                onChange={this.onPhoneCountChanged}
                value={PhoneCount}
                maxLength={12}
                placeholder="请输入座机电话数量"
              />
            </FormItem>
            <FormItem title="坐席数量：" isRequire thWidth={120}>
              <Input
                onChange={this.onSeatCountChanged}
                value={SeatCount}
                maxLength={12}
                placeholder="请输入坐席数量"
              />
            </FormItem>
            <FormItem title="营业执照：" isRequire>
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