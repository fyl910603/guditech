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
  keywords: any;
  typeid: any;
  iscommon: boolean;
  pageindex: number;
  pagecount: number;
}
interface Props {
  dispatch: (props: any) => void;
  data: any
}
class Component extends React.PureComponent<Props,State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      keywords: '',
      typeid:0 ,
      iscommon:true,
      pageindex:1,
      pagecount:10
    };
  }

  componentDidMount() {
    this.getQuestionTypeList()
    this.getQuestionList()
  }

  componentWillUnmount() {
  }
  jumpMore(){
    router.push('/help/faq')
  }
  handleItem(typeid,name){
    router.push({
      pathname: '/help/faq',
      query:{
        id:typeid,
        name:name
      }
    })
  }
  jumpToDetail(Id,name){
    router.push({
      pathname: `/help/${Id}`,
      query:{
        Cname:name
      }
    })
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
  getQuestionTypeList() {
    this.props.dispatch({
      type: `${namespace}/fetchQuestionType`,
      payload: {

      },
    });
  }
  render() {
    const { typeData,questionList} = this.props.data
    let typeList = typeData.map((item,index) =>(
      <div key={item.TypeId} className={styles.classifyItem} onClick={()=>this.handleItem(item.TypeId,item.TypeName)}>
      <div className={(index+1) == typeData.length?styles.IconBox1:styles.IconBox}>
        <img src={item.TypeIconUrl} alt={item.TypeName} className={styles.IconImg}/>
      </div>
      <p className={styles.nameBox}>
        {item.TypeName}
      </p>
      </div>
    ))
    let commonList = questionList.slice(0,9).map((item,index) =>(
      <div className={styles.Item} key={item.QuestionId} onClick={()=>this.jumpToDetail(item.QuestionId,item.QuestName)}>
        <i className={styles.point}></i>
        <span className={styles.questionName}>{item.QuestName}</span>
      </div>
    ))
    return (
      <div className={styles.page} >
        <div className={styles.searchBox}>
          <Icon type="search" className={styles.searchIcon} />
          <Input type="text" placeholder="请在这里输入您要查找的问题 例：忘记密码" onFocus={()=>this.jumpMore()} className={styles.inputBox}></Input>
          <Button type="primary" className={styles.searchButton}>搜索</Button>
        </div>
        <div className={styles.classifyBox}>
          <p className={styles.title}><span>问题分类</span></p>
          <div className={styles.classifyContentBox}>
            {typeList}
          </div>
        </div>
        <div className={styles.classifyBox}>
          <p className={styles.title}><span>常见问题</span><span className={styles.more} onClick={()=>this.jumpMore()}>更多></span></p>
          <div className={styles.questionBox}>
              {commonList}
          </div>
        </div>
        <div className={styles.classifyBox}>
          <p className={styles.title}><span>服务热线</span></p>
          <div className={styles.contactBox}>
            <p>0571-87820281</p>
            <p>（工作时间为周一至周五 9:00-18:00）</p>
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