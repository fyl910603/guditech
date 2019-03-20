import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button, Input, Icon,Collapse} from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { namespace } from './model';
import { PictureShow } from 'components/pictureShow';
import { PictureUpload } from 'components/pictureUpload';
import { AddressPick } from 'components/addressPick';
import { MessageBox } from 'components/messageBox';
import router from 'umi/router';

let divForm: HTMLDivElement;
interface State {
  id: string,
  IsOpen:boolean,
}
interface Props {
  dispatch: (props: any) => void;
  data: any
}
class Component extends React.PureComponent<Props> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      id: '',
      IsOpen:false
    };
  }

  componentDidMount() {
    this.getDelegateDetails(this.props.location.query.Id)
  }

  componentWillUnmount() {
  }
  getDelegateDetails = (id) => {
    this.props.dispatch({
      type: `${namespace}/fetchdelegateDetail`,
      payload: {
        Id: id,
      },
    });
  }
  openContent = () =>{
    this.setState({
      IsOpen:(!this.state.IsOpen)
    })
  }
  
  render() {
    const { delegateInfo } = this.props.data
    return (
      <div className={styles.Detail_contianer}>
        <div className={styles.item_container}>
          <div className={styles.title_Box}>
            <i className={styles.delegate_content_icon}></i>
            <span className={styles.info_title}>委托内容</span>
          </div>
          <div className={styles.info_box}>
            <p className={styles.item_p}>
              <span>活动有效期：</span>
              <span>{delegateInfo.DelegateStartTime}至{delegateInfo.DelegateEndTime}</span>
            </p>
            <p className={styles.item_p}>
              <span>活动时间：</span>
              <span>{delegateInfo.StartTime}至{delegateInfo.EndTime}</span>
            </p>
            <p className={styles.item_p}>
              <span>活动名称：</span>
              <span>{delegateInfo.Name}</span>
            </p>
            <div className={styles.item_content_box}>
                <p className={styles.item_content_p}>活动内容：</p>
                <p>{(delegateInfo.Description != undefined && delegateInfo.Description.length>30)?delegateInfo.Description.substring(0,30):delegateInfo.Description}<Icon type={this.state.IsOpen?'up':'down'} onClick={()=>this.openContent()}/></p>
                { delegateInfo.Description != undefined && delegateInfo.Description.length>30 && (
                    <div className={styles.item_content_info}>
                      {this.state.IsOpen?delegateInfo.Description.substring(30):''}
                    </div>
                  )
                }
            </div>
            <p className={styles.item_p}>
              <span>活动地点：</span>
              <span>2018-12-13至2019-01-24</span>
            </p>
            <p className={styles.item_p}>
              <span>委托数量：</span>
              <span>{delegateInfo.DelegateCount}人</span>
            </p>
            <p className={styles.item_p}>
              <span>单价：</span>
              <span>{delegateInfo.UnitPrice}元/人</span>
            </p>
            <p className={styles.item_p}>
              <span>实际人数：</span>
              <span>{delegateInfo.RealDelegationCount}人</span>
            </p>
            <p className={styles.item_p}>
              <span>总价：</span>
              <span>{delegateInfo.TotalPrice}元</span>
            </p>
            <p className={styles.item_p}>
              <span>委托备注：</span>
              <span>{delegateInfo.Remark}</span>
            </p>
            <p className={styles.item_p}>
              <span>联系人：</span>
              <span>{delegateInfo.ContactsName}</span>
            </p>
          </div>
        </div>
        <div className={styles.item_container}>
          <div className={styles.title_Box}>
            <i className={styles.delegate_content_icon}></i>
            <span className={styles.info_title}>执行情况</span>
          </div>
          <div className={styles.info_box}>
            <p className={styles.item_p}>
              <span>未预约人数：</span>
              <span>{delegateInfo.Unbooked}</span>
            </p>
            <p className={styles.item_p}>
              <span>已预约人数：</span>
              <span>{delegateInfo.Reservations}</span>
            </p>
            <p className={styles.item_p}>
              <span>实际到店人数：</span>
              <span>{delegateInfo.Arrival}</span>
            </p>
            <p className={styles.item_p}>
              <span>目前到店率：</span>
              <span>{delegateInfo.ArrivalRate}</span>
            </p>
          </div>
        </div>
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