import * as React from 'react';
import styles from './styles.less';
import { Table, DatePicker, Icon, Modal, Button} from 'antd';
let div: HTMLDivElement = null;
let timeout: any = null;
export interface Props {
  phoneData: Object;
  data: any;
  onSuccess: (code) => void;
  onClose: () => void;
  onError: (msg: string) => void;
}
// const ws = new WebSocket('ws://123.206.174.209:12345');
const setSeat = {
  1: '座机',
  2: '网络电话',
};
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
    console.log('update')
  }
  componentDidMount(){
    
    // ws.onopen = function (evt) {
    //   console.log("Connection open ...");
    //   ws.send(JSON.stringify({ActionCode:"000001",Type:"0101",Data:{UserToken:"875C24DA-545F-4EB7-87BA-25FC2BB29267",FamilyId:3573791,AddressId:3573790,ChildId:3915431,FromExtenId:2,OrderId:1}}));
    // };
    // ws.onopen = function (evt){
    //   console.log('connect open')
    //   ws.send('hello')
    // }
    // ws.onmessage = function (evt) {
    //   console.log("Received Message: " + evt.data);
    //   // ws.close();
    // };

    // ws.onclose = function (evt) {
    //   console.log("Connection closed.");
    // };
  }
  componentWillUnmount(){
    // ws.onclose = function (evt) {
    //   console.log("Connection closed.");
    // };
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
    var hh = parseInt(a / 3600);
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
  onCalling = () =>{
    this.setState({msg:'通话中'});
    this.clockSeconds()
    this.setState({
      showSeconds:true
    })
  }
  toCallPhone = ()=>{
    const ws = new WebSocket('ws://123.206.174.209:12345');
    // console.log(ws)
    ws.onopen = function (evt) {
      console.log("Connection open ...");
      // ws.send('hello')
      ws.send(JSON.stringify({ActionCode:"000001",Type:"0101",Data:{UserToken:"875C24DA-545F-4EB7-87BA-25FC2BB29267",FamilyId:3573791,AddressId:3573790,ChildId:3915431,FromExtenId:2,OrderId:1}}));
    };
    let _this = this 
    ws.onmessage = function (evt) {
      // console.log("Received Message: " + evt.data);
      let data = JSON.parse(evt.data)
      console.log(evt.data)
      if(data.Status!= undefined){
        switch(data.Status){
          case 1:
            _this.setState({msg:'拨号中'});
            break;
          case 2:
            _this.onCalling();
            // _this.setState({msg:'主叫振铃'});
            break;
          case 3:
            _this.setState({msg:'被叫振铃'});
            break;
          case 4:
            _this.onCalling();
            break;
          case 5:
            _this.setState({msg:'挂断中'});
            break;
          case 6:
            _this.setState({msg:'已挂断'});
            break;
          default:
          break;
        }
      }
    };
    
    // ws.onerror = function(evt){
    //   console.log("Error Message: " + evt);
    // }
    // ws.onclose = function (evt) {
    //   console.log("Connection closed.");
    // };
    this.setState({
      visible:false,
      showMsg:true,
      msg:'拨号中...'
    })
    // div = document.createElement('div');
    // div.innerHTML = '测试下';
    // div.className = styles.msg;
  }
  toSetDefault = (record) =>{
    localStorage.setItem('defaultSeatCall',record.SeatId)
  }
  render(){
    const {data,phoneData} = this.props
    // console.log(this.props)
    let backgroundColor = ''
    switch (this.state.callStatus){
      case '4':
        backgroundColor = '#9D9D9D';
      default:
        backgroundColor = '#e73c2c';
        break;
    }
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
                 && (<Button type="primary" size="small" disabled>设为默认</Button>)
                }
              </React.Fragment>
            }
          </span>
        ),
      },
    ];
    return(
      <div>
        <Modal title={`确定拨打`} visible={this.state.visible}
        style={{ top: 100 }}
        width='530px'
        onCancel={this.handleCancel}
        footer={[
          <Button key="back"  size="default" onClick={() => this.handleCancel()}>关闭</Button>,
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
          <div className={styles.msgStatusIcon} style={{backgroundColor}}>
            <Icon type="phone" className={styles.callIcon}></Icon>
          </div>
        </div>
      )}
      </div>
    )
  }
}