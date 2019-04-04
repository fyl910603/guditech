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
let ws = undefined;
let seconds = 0
let _this = undefined;
let interval = undefined;
const setSeat = {
  1: '座机',
  2: '网络电话',
};
const UserToken = getUser().UserToken
interface State {
  visible:boolean;
  showMsg:boolean;
  showToCall:boolean;
  showSeconds:boolean;
  Seconds:any;
  seconds:any;
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
      showToCall:true,
      Seconds:0,
      seconds:0,
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
    this.myStop()
    clearInterval(interval)
    clearTimeout()
    ws.onclose = function(){
      console.log('webscoket连接关闭')
    }
  }
  handleCancel = ()=>{
    this.setState({
      visible:false
    })
  }
  tick = () =>{
    this.setState(()=>({
      Seconds:this.formatSeconds(++seconds)
    }))
  }
  interval =()=>{
    interval = setInterval(()=>{
      this.tick()
    },1000);
    return interval
  } 
  myStop = ()=>{
    clearInterval(interval)
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
    this.setState({msg:'通话中...'});
    this.setState({
      showSeconds:true
    })
    this.interval()
  }
  //呼叫中 
  toCalling = () =>{
    this.setState({msg:'呼叫中...'});
  }
  // 已挂断
  onHangUp = () =>{
    this.myStop()
    clearInterval()
    let _this = this
      this.setState({
        callStatus:'2',
      })
    this.setState({msg:'已挂断'});
    setTimeout(()=>{
      _this.setState({
        showMsg:false,
        showToCall:true,
      })
      _this.onClose()
    },1500)
    
  }
  onHangUping = () =>{
    this.myStop()
    this.setState({msg:'挂断中...'});
  }
  // 挂断电话
  toHangUp = () =>{
    let _this = this
    this.setState({msg:'挂断中...'});
    this.myStop()
    clearInterval(interval)
    ws.send(JSON.stringify({ActionCode:"000001",Type:"0103",Data:null}));
    setTimeout(()=>{
      if(_this.state.msg != '已挂断'){
        _this.onHangUp()
      }
    },1500)
    
    ws.onmessage = function (evt) {
      let data = JSON.parse(evt.data)
      console.log(evt.data)
      if(data.Status!= undefined){
        switch(data.Status){
          case 1:
            _this.setState({msg:'拨号中...'});
            break;
          case 2:
            _this.toCalling();
            break;
          case 3:
            _this.setState({msg:'呼叫中...'});
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
      }
    } 
  }
  getWebsocket = () =>{
    ws = new WebSocket('wss://test.guditech.com/marketingCall');
    return ws
  }
  toCallPhone = ()=>{
    seconds = 0
    this.getWebsocket()
    const {phoneData} = this.props
    this.setState({
      callStatus:'',
      visible:false,
      showMsg:true,
      showToCall:false,
      msg:'拨号中...'
    })
    let _this = this 
      // const ws = new WebSocket('wss://test.guditech.com/marketingCall');
      ws.onopen = function (evt) {
        console.log("Connection open ...");
        let action = {ActionCode:"000001",Type:"0101",Data:{UserToken:UserToken,FamilyId:phoneData.FamilyId,AddressId:phoneData.AddressId,ChildId:phoneData.ChildId,FromExtenId:localStorage.getItem('defaultSeatCall'),OrderId:phoneData.OrderId}}
        ws.send(JSON.stringify(action));
      };
      ws.onmessage = function (evt) {
        let data = JSON.parse(evt.data)
        if(data.Status!= undefined){
          switch(data.Status){
            case 1:
              _this.setState({msg:'拨号中...'});
              break;
            case 2:
              _this.toCalling();
              break;
            case 3:
              _this.setState({msg:'呼叫中...'});
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
        }else if (data.Data.Code != 0){
          _this.setState({
            callStatus:'2',
          })
        _this.setState({msg:data.Data.Message});
        _this.myStop()
        setTimeout(()=>{
          _this.setState({
            showMsg:false
          })
          _this.onClose()
        },3000)
        }
      };
  }
  // 设置坐席
  toSetDefault = (record) =>{
    localStorage.setItem('defaultSeatCall',record.SeatId);
    const { onchangeD } = this.props;
    if(onchangeD){
      onchangeD()
    }
  }
  onClose = () => {
    this.getWebsocket()
    this.myStop()
    clearInterval(interval)
    ws.onclose = function(){
      console.log('webscoket连接关闭')
    }
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };
  NotClose = () =>{
    // 不执行方法
  }
  render(){
    const {data,phoneData} = this.props
    const columns: any = [
      {
        title: '座席编号',
        dataIndex: 'SeatNumber',
        align: 'center',
      },
      {
        title: '电话号码',
        dataIndex: 'CallMobile',
        align: 'center',
      },
      {
        title: '电话类型',
        dataIndex: 'Mobile',
        align: 'center',
        render:(text,h) =>{
          return setSeat[h.CallType]
        }
      }
    ];
    const rowSelection = {
      type:'radio',
      onChange: (selectedRowKeys, selectedRows) => {
      },
      onSelect: (record) => {
        this.toSetDefault(record)
      },
      getCheckboxProps: record => ({
        checked: record.SeatId == localStorage.getItem('defaultSeatCall')?true:false,    // 默认选中
      }),
    };
    return(
      <div>
        {this.state.showToCall && (<Modal title={`确定拨打`} visible={true}
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
            rowSelection={rowSelection}
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
        </Modal>)}
      {this.state.showMsg&& (
        <div className={styles.callContainer} onClick={()=>this.NotClose()}>
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
        </div>
      )}
      </div>
    )
  }
}