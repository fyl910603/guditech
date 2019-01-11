import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button, Input, Icon, Pagination} from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { namespace } from './model';
import { PictureShow } from 'components/pictureShow';
import { PictureUpload } from 'components/pictureUpload';
import { AddressPick } from 'components/addressPick';
import { MessageBox } from 'components/messageBox';

let divForm: HTMLDivElement;
interface State {
  keywords: any;
  typeid: any;
  iscommon: boolean;
  pageindex: number;
  pagecount: number;
}
interface Props {
  dispatch: (props: any) => void;
  data:any
}
class Component extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      keywords: '',
      typeid:0,
      iscommon:false,
      pageindex:1,
      pagecount:15
    };
  }

  componentDidMount() {
    this.getQuestionList()
    console.log(this.props.data)
  }

  componentWillUnmount() {
  }

  getQuestionList = () =>{
    this.props.dispatch({
      type: `${namespace}/fetchQuestion`,
      payload: {
        typeid: this.state.typeid,
        key: this.state.keywords,
        iscommon: this.state.iscommon,
        pageindex: this.state.pageindex,
        pagecount: this.state.pagecount,
      },
    });
  }
  onSelect = e => {
    // this.props.dispatch({
    //   type: `${namespace}/fetch`,
    //   payload: {
    //     container: this.divForm,
    //     pageindex: 1,
    //   },
    // });
  };

  onPageChanged = (pageindex, pagecount) => {
    // this.props.dispatch({
    //   type: `${namespace}/fetch`,
    //   payload: {
    //     pageindex,
    //     container: this.divForm,
    //   },
    // });
  };

  onDateChanged = e => {
    // this.props.dispatch({
    //   type: `${namespace}/onDateChanged`,
    //   payload: e,
    // });
  };
  emitEmpty = () => {
    this.setState({ keywords: '' });
  }
  onChangeUserName = (e) => {
    this.setState({ keywords: e.target.value });
    this.getQuestionList()
  }
  onShowSizeChange = (current, pageSize) =>{
    console.log(current, pageSize);
  }
  render() {
    const { keywords } = this.state;
    const {questionList} = this.props.data
    const suffix = keywords ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    console.log(questionList)
    
    
    return (
      <div className={styles.page} >
        <div className={styles.searchBox}>
          <Icon type="search" className={styles.searchIcon} />
          <Input 
          value={keywords} 
          ref={keywords} 
          onChange={this.onChangeUserName} 
          type="text" 
          placeholder="请在这里输入您要查找的问题 例：忘记密码" 
          className={styles.inputBox} 
          ></Input>
          <Button type="primary" className={styles.searchButton}>搜索</Button>
        </div>
        <div className={styles.questionBox}>
          <div className={styles.questionList}>
          </div>
          <div className={styles.qPagination}>
            <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange} defaultCurrent={3} total={500} />
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