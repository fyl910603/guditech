import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button, Input, Icon } from 'antd';
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
  id : string
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
      id:''
    };
    this.getQuestionDetails(this.props.match.params.id)
  }

  componentDidMount() {
    // this.getQuestionDetails(this.props.match.params.id)
  }
  
  componentWillUnmount() {
  }
  getQuestionDetails = (id) =>{
    this.props.dispatch({
      type: `${namespace}/fetchQuestionDetail`,
      payload: {
        id: id,
      },
    });
  }
  render() {
    const {details} = this.props.data
    let list
    if(details != undefined){
      list = 
      <div>
        <div className={styles.title_box}>
          <span>问：{details.QuestName}</span>
          <span>{details.UpdateTime}</span>
        </div>
        <div className={styles.contentInfo}>
          <p className={styles.da}>答:</p><div dangerouslySetInnerHTML={{ __html: details.Answer}} ></div>
        </div>
      </div>
    }
    return (
      <div className={styles.pageInfo} >
        {details != undefined ? list : ''}
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