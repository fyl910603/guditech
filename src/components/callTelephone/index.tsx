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
const setSeat = {
  1: '座机',
  2: '网络电话',
};
interface State {
  visible:boolean;
}
export class CallTelephone extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      visible:true,
    };

  }
  componentWillUpdate(){
    console.log('update')
  }
  componentDidMount(){
    
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
  toCallPhone = ()=>{
    const ws = new WebSocket('ws://123.206.174.209:12345');
    ws.onopen = function (evt) {
      console.log("Connection open ...");
      ws.send(JSON.stringify({ActionCode:"000001",Type:"0101",Data:{UserToken:"875C24DA-545F-4EB7-87BA-25FC2BB29267",FamilyId:3573791,AddressId:3573790,ChildId:3915431,FromExtenId:2,OrderId:1}}));
    };
    // ws.onopen = function (evt){
    //   console.log('connect open')
    //   ws.send('hello')
    // }
    ws.onmessage = function (evt) {
      console.log("Received Message: " + evt.data);
      ws.close();
    };

    ws.onclose = function (evt) {
      console.log("Connection closed.");
    };
    this.setState({
      visible:false
    })
    div = document.createElement('div');
    div.innerHTML = '测试下';
    div.className = styles.msg;
  }
  toSetDefault = (record) =>{
    localStorage.setItem('defaultSeatCall',record.SeatId)
  }
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
                 && (<Button type="primary" size="small" disabled>设为默认</Button>)
                }
              </React.Fragment>
            }
          </span>
        ),
      },
    ];
    return(
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
    )
  }
}