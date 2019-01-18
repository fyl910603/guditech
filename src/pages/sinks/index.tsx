import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button, Modal,Divider, Table,Tooltip,Icon,Input,message} from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { PictureShow } from 'components/pictureShow';
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
  currData : object,
  editImgUrl: string,
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
      currData:{},
      editImgUrl : '',
      Path:''
    };
    this.getSignList()
  }
  componentDidMount() {
    console.log(this.props)
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
      this.props.dispatch({
      type: `${namespace}/save`,
      payload: {
        SignId: this.state.currData.SignId,
        editSignName: this.state.currData.SignName,
        editImgUrl:this.state.Path
      },
    });
      console.log(this.props)
      e.preventDefault();
      // this.setState({
      //   editvisible: false,
      // });
    }
  handleCancel = (e) => {
    this.setState({
      editvisible: false,
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
      })
      console.log(this.state.currData)
    },50)
    
  };
  onDelete = record => {
    confirm({
      title: '确定要删除该模板吗？',
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/onDelete`,
          payload: record.TemplateSysId,
        });
      },
    });
  };
   onSignnameChanged =(e)=>{
      this.setState({
        currData:Object.assign(this.state.currData,{SignName:e.target.value})
      })
    }
    picUpload = (data)=>{
        this.setState({
          currData:Object.assign(this.state.currData,{LicenceUrl:data.ImgUrl}),
          Path:data.ImgPath
        })
        setTimeout(()=>{
          this.setState({
            editImgUrl:data.ImgUrl
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
        title: '签名',
        dataIndex: 'SignName',
        width: 150,
        align:'center'
      },
      {
        title: '营业执照',
        dataIndex: 'LicenceUrl',
        width: 150,
        align:'center'
      },
      {
        title: '审核状态',
        width: 150,
        dataIndex: 'ExamineStateName',
        align:'center',
        render: (text, h) => {
          const red = h.Status === 4 || h.Status === 5;
          if (h.Status === 4 || h.Status === 5) {
            return (
              <Tooltip placement="topLeft" title={h.ErrorReason} arrowPointAtCenter>
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
        dataIndex: 'ApplyTime',
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
      1: '等待审核',
      2: '审核中',
      3: '认证成功',
      4: '认证失败',
      5: '无效',
    };
    const {signList, isShowEdit, currData} = this.props.data
    const canSave = currData.Status === undefined || currData.Status === 1 || currData.Status === 4;
    const listData = signList.map(h => ({
      ...h,
      ExamineStateName: statusMap[h.Status],
    }));
    let table
    if(signList.length>0){
      table = <Table
      columns={columns}
      dataSource={listData}
      pagination={false}
      // scroll={{ y: height }}
      bordered={true}
      rowKey="SignId"
      locale={{
        emptyText: '暂无客户数据',
      }}
    />
    }
    return (
      <div className={styles.page} >
        <div className={styles.hintBox}>
          <span className={styles.hint}>您可以通过短信方式与目标客户建立更精准、快捷的连接，大大降低拓客成本.点击此处</span><span className={styles.textBtn}>申请短信业务</span>
        </div>
        <div className={styles.divTable}>
          {signList.length > 0 ?table : ''}
        </div>
        {/* <SplitPage
          pageIndex={pageindex}
          total={totalCount}
          pageSize={pagecount}
          onPageChanged={this.onPageChanged}
        /> */}
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
      </div>
    );
  }
}
// const Component = ({ dispatch, data }) => {
//   function onSubmit(e) {
//     e.preventDefault();

//     dispatch({
//       type: `${namespace}/save`,
//       payload: {
//         container: divForm,
//       },
//     });
//   }

//   function onSignnameChanged(e) {
//     dispatch({
//       type: `${namespace}/signnameChanged`,
//       payload: e.target.value,
//     });
//   }
//   function picUpload(data) {
//     dispatch({
//       type: `${namespace}/picUpload`,
//       payload: data,
//     });
//   }

//   function onPicUploadError(error) {
//     MessageBox.show(error, divForm);
//   }
//   const { lastData, currData, isShowLastInfo, isShowEdit } = data;

//   const canSave = currData.Status === undefined || currData.Status === 1 || currData.Status === 4;

//   function onOpenLastInfo() {
//     dispatch({
//       type: `${namespace}/showLastInfo`,
//       payload: true,
//     });
//   }
//   function onCloseLastInfo() {
//     dispatch({
//       type: `${namespace}/showLastInfo`,
//       payload: false,
//     });
//   }
//   function onCloseEdit(){
//     this.props.dispatch({
//       type: `${namespace}/showEdit`,
//       payload: {
//         isShowEdit: false,
//       },
//     });
//   };

//   function onSave(data, container){
//     this.props.dispatch({
//       type: `${namespace}/onSave`,
//       payload: {
//         container,
//         data,
//       },
//     });
//   };
//   const statusList = {
//     1: '您好，您提交的资料正在等待审核中请您耐心的等待下，1-3个工作日会反馈审核结果',
//     2: '您好，您提交的资料正在审核中请您耐心的等待下，1-3个工作日会反馈审核结果',
//     3: '您好，您提交的资料已审核通过',
//     4: '您好，您提交的资料已审核失败',
//     5: '您好，您提交的资料已被管理员作废',
//   };

//   let backgroundColor = '';
//   switch (currData.Status) {
//     case 4: // 失败
//       backgroundColor = '#9e2f26';
//       break;
//     case 3: // 通过
//       backgroundColor = '#407733';
//       break;
//     default:
//       backgroundColor = '#5FD6EB';
//       break;
//   }
//   return (
//     <div className={styles.page} ref={obj => (divForm = obj)}>
//       <div className={styles.status} style={{ backgroundColor }}>
//         <span>{statusList[currData.Status]}</span>
//         {lastData && (
//           <LinkButton type="primary" className={styles.btnLink} onClick={onOpenLastInfo}>
//             查看原有资料
//           </LinkButton>
//         )}
//       </div>
//       {isShowEdit && (
//           <SmsTemplateEdit
//             isEdit={true}
//             data={currData}
//             onSave={this.onSave}
//             onClose={this.onCloseEdit}
//           />
//         )}
//         <div className={styles.form}>
//           <Form>
//             <FormItem title="签名：" thWidth={120}>
//               <Input2
//                 onChange={onSignnameChanged}
//                 value={currData.SignName}
//                 maxLength={12}
//                 placeholder="请输入签名信息"
//               />
//             </FormItem>
//             <FormItem title="营业执照：">
//               <div className={styles.picItem}>
//                 <PictureShow type={2} url={currData.LicenceUrl} />
//                 <PictureUpload
//                   onSuccess={picUpload}
//                   onError={onPicUploadError}
//                   type={2}
//                   title="上传营业执照"
//                 />
//               </div>
//             </FormItem>
//             <FormItem>
//               <Button type="primary" onClick={onSubmit} disabled={!canSave}>
//                 保存
//               </Button>
//             </FormItem>
//           </Form>
//         </div>
//       {lastData && (
//         <Modal
//           title="查看原有资料"
//           visible={isShowLastInfo}
//           onOk={onCloseLastInfo}
//           okText="确认"
//           className={styles.modalLast}
//           closable={false}
//         >
//           <Form>
//             <FormItem title="签名">
//               <Input2 value={lastData.SignName} disabled={true} />
//             </FormItem>
//             <FormItem title="营业执照">
//               <PictureShow type={2} url={lastData.LicenceUrl} />
//             </FormItem>
//           </Form>
//         </Modal>
//       )}
//     </div>
//   );
// };

const mapStateToProps = state => {
  return {
    data: state[namespace],
  };
};

export default connect(mapStateToProps)(Component);
