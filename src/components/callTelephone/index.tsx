import * as React from 'react';
import styles from './styles.less';
import { MessageBox } from 'components/messageBox';
import { Table, DatePicker, Icon, Modal, Button} from 'antd';
import { getUser } from 'utils/localStore';
import { async } from 'q';
let div: HTMLDivElement = null;
let timeout: any = null;
export interface Props {
  phoneData: Object;
  data: any;
  onchangeD?: () => void;
  onSuccess: (code) => void;
  onClose: () => void;
  onError: (msg: string) => void;
}
const ws = new WebSocket('wss://test.guditech.com/marketingCall');
const setSeat = {
  1: '座机',
  2: '网络电话',
};
const UserToken = getUser().UserToken
interface State {
  visible:boolean;
  showMsg:boolean;
  showSeconds:boolean;
  Seconds:any;
  msg:string;
  callStatus:string;
}
export class CallTelephone extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      visible:true,
      showMsg:false,
      Seconds:0,
      showSeconds:false,
      msg:'',
      callStatus:''
    };

  }
  componentWillUpdate(){  
  }
  componentDidMount(){
  }
  componentWillUnmount(){
    console.log('销毁')
    ws.onclose = function(){
      console.log('webscoket连接关闭')
    }
  }
  handleCancel = ()=>{

    this.setState({
      visible:false
    })
  }
  clockSeconds = () =>{
    let seconds = 0;
    let _this = this
    setInterval(()=>{
      _this.setState({
        Seconds:_this.formatSeconds(seconds++)
      })
    },1000)
  }
  formatSeconds = (a) => {
    var hh= parseInt(a / 3600);
    if (hh < 10) hh = "0" + hh;
    var mm = parseInt((a - hh * 3600) / 60);
    if (mm < 10) mm = "0" + mm;
    var ss = parseInt((a - hh * 3600) % 60);
    if (ss < 10) ss = "0" + ss;
    var length = hh + ":" + mm + ":" + ss;
    if (a > 0) {
      return length;
    } else {
      return "00:00:00";
    }
  }
  // 通话中
  onCalling = () =>{
    this.setState({msg:'通话中'});
    this.clockSeconds()
    this.setState({
      showSeconds:true
    })
  }
  //呼叫中 
  toCalling = () =>{
    this.setState({msg:'呼叫中...'});
  }
  // 已挂断
  onHangUp = () =>{
    let _this = this
      this.setState({
        callStatus:'2',
      })
    this.setState({msg:'已挂断'});
    clearInterval()
    setTimeout(()=>{
      _this.setState({
        showMsg:false,
      })
    },3000)
  }
  onHangUping = () =>{
    this.setState({msg:'挂断中'});
  }
  // 挂断电话
  toHangUp = () =>{
    ws.onopen = function (evt) {
      ws.send(JSON.stringify({ActionCode:"000001",Type:"0103",Data:null}));
    };
    ws.onmessage = function (evt) {
      console.log(evt.data)
    }
  }
  toCallPhone = ()=>{
    const ws = new WebSocket('wss://test.guditech.com/marketingCall');
    const {phoneData} = this.props
    console.log(ws)
    ws.onopen = function (evt) {
      console.log("Connection open ...");
      let action = {ActionCode:"000001",Type:"0101",Data:{UserToken:getUser().UserToken,FamilyId:phoneData.FamilyId,AddressId:phoneData.AddressId,ChildId:phoneData.ChildId,FromExtenId:localStorage.getItem('defaultSeatCall'),OrderId:phoneData.OrderId}}
      console.log(action)
      ws.send(JSON.stringify(action));
    };
    let _this = this 
    ws.onmessage = function (evt) {
      let data = JSON.parse(evt.data)
      console.log(data.Status)
      if(data.Status!= undefined){
        switch(data.Status){
          case 1:
            _this.setState({msg:'拨号中...'});
            break;
          case 2:
            _this.toCalling();
            break;
          case 3:
            _this.setState({msg:'被叫振铃'});
            break;
          case 4:
            _this.onCalling();
            break;
          case 5:
            _this.onHangUping()
            break;
          case 6:
            _this.onHangUp()
            break;
          default:
          break;
        }
      }else{
        _this.setState({
          showMsg:false
        })
      }
    };
    this.setState({
      visible:false,
      showMsg:true,
      msg:'拨号中...'
    })
  }
  toSetDefault = (record) =>{
    localStorage.setItem('defaultSeatCall',record.SeatId);
    const { onchangeD } = this.props;
    if(onchangeD){
      onchangeD()
    }
  }
  onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };
  render(){
    const {data,phoneData} = this.props
    const columns: any = [
      {
        title: '电话号码',
        dataIndex: 'CallMobile',
        align: 'center',
      },
      {
        title: '座席编号',
        dataIndex: 'SeatNumber',
        align: 'center',
      },
      {
        title: '电话类型',
        dataIndex: 'Mobile',
        align: 'center',
        render:(text,h) =>{
          return setSeat[h.CallType]
        }
      },
      {
        title: '',
        key: 'action',
        align: 'center',
        render: (text, h) => (
          <span>
            {
              <React.Fragment>
                {localStorage.getItem('defaultSeatCall') != h.SeatId
                 && (<Button type="primary" size="small" onClick={()=>this.toSetDefault(h)}>设为默认</Button>)
                }
                {localStorage.getItem('defaultSeatCall') == h.SeatId
                 && (<Button type="primary" size="small" disabled={localStorage.getItem('defaultSeatCall') == h.SeatId?true:false}>设为默认</Button>)
                }
              </React.Fragment>
            }
          </span>
        ),
      },
    ];
    return(
      <div>
        <Modal title={`确定拨打`} visible={true}
        style={{ top: 100 }}
        width='530px'
        onCancel={this.onClose}
        footer={[
          <Button key="back"  size="default" onClick={() => this.onClose()}>关闭</Button>,
          <Button key="submit" type="primary" size="default" onClick={() => this.toCallPhone()}>拨打</Button>
        ]}
      >
        <div className={styles.textareaBox}>
        <Table
            className={styles.tableContent}
            columns={columns}
            dataSource={data}
            pagination={false}
            // scroll={{ y: height }}
            rowKey="SeatId"
            bordered={true}
            locale={{
              emptyText: '暂无记录',
            }}
          />
        </div>
      </Modal>
      {this.state.showMsg&& (
        <div className={styles.msg}>
          <p className={styles.mobileNumber}>{phoneData.Mobile}</p>
          <p className={styles.msgStatus}>{this.state.msg}</p>
          {this.state.showSeconds && (
            <p>{this.state.Seconds!= 0?this.state.Seconds: '00:00:00'}</p>
          )}
          <div onClick={()=>this.toHangUp()} className={this.state.callStatus == '2'?styles.msgErrorIcon:styles.msgSuccessIcon} >
            <Icon type="phone" className={styles.callIcon}></Icon>
          </div>
        </div>
      )}
      </div>
    )
  }
}