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
import router from 'umi/router';

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
      typeid:0 | this.props.location.query,
      iscommon:false,
      pageindex:1,
      pagecount:15
    };
  }
  componentDidMount() {
    this.getQuestionList()
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
  onChangeUserName = (e) => {
    if(e.target.value != this.state.keywords  ){
      this.setState({ keywords: e.target.value });
    }
    if(e.target.value == ''){
      this.setState({ keywords: '' });
      setTimeout(()=>{
        this.getQuestionList()
      },50)
    }
  }
  onSearch(){
    this.getQuestionList()
  }
  onChange = (page) =>{
    this.setState({
      pageindex: page
    })
    setTimeout(()=>{
      this.getQuestionList()
    },50)
  }
  jumpToDetail(Id){
    router.push(`/help/${Id}`)
  }
  render() {
    const { keywords } = this.state;
    const {questionList,questionTotal} = this.props.data
    let list = questionList.map((item,index) =>(
      <div 
      key={item.QuestionId} 
      className={(index+1) == questionList.length?`${styles.list_item} ${styles.noborder}`:styles.list_item}
      >
        <p className={styles.item_left}>
          <span>{index+1}、</span>
          <span className={styles.item_title} onClick={()=>this.jumpToDetail(item.QuestionId)}>{item.QuestName}</span>
          <span className={item.IsTop?styles.item_top:styles.none}>置顶</span>
        </p>
        <p className={styles.item_right}>
          <span>{item.UpdateTime}</span>
          <span>></span>
        </p>
      </div>
    ))
    let noneList = 
                <div className={styles.noneQuestion}>
                  没有搜到相关问题哦，请尝试搜索其它关键字
                </div>
    
    return (
      <div>
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
            onPressEnter={()=>this.onSearch()}
            ></Input>
            <Button type="primary" className={styles.searchButton} onClick={()=>this.onSearch()}>搜索</Button>
          </div>
          <div className={styles.questionBox}>
            <div className={styles.questionList}>
              {questionList.length>0 ?list : noneList}
            </div>
          </div>
        </div>
        <div className={styles.qPagination}>
          <Pagination onChange={this.onChange} pageSize={15} current={this.state.pageindex} total={questionTotal} />
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