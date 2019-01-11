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

let divForm: HTMLDivElement;
interface State {

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
    };
  }

  componentDidMount() {
    this.getQuestionTypeList()
  }

  componentWillUnmount() {
  }

  getQuestionTypeList() {
    this.props.dispatch({
      type: `${namespace}/fetchQuestionType`,
      payload: {

      },
    });
  }
  render() {
    const { typeData } = this.props.data
    let typeList = typeData.map((item,index) =>(
      <div key={item.TypeId} className={styles.classifyItem}>
      <div className={(index+1) == typeData.length?styles.IconBox1:styles.IconBox}>
        <img src={item.TypeIconUrl} alt={item.TypeName} className={styles.IconImg}/>
      </div>
      <p className={styles.nameBox}>
        {item.TypeName}
      </p>
      </div>
  ))
    return (
      <div className={styles.page} >
        <div className={styles.searchBox}>
          <Icon type="search" className={styles.searchIcon} />
          <Input type="text" placeholder="请在这里输入您要查找的问题 例：忘记密码" className={styles.inputBox}></Input>
          <Button type="primary" className={styles.searchButton}>搜索</Button>
        </div>
        <div className={styles.classifyBox}>
          <p className={styles.title}><span>问题分类</span></p>
          <div className={styles.classifyContentBox}>
            {typeList}
          </div>
        </div>
        <div className={styles.classifyBox}>
          <p className={styles.title}><span>常见问题</span><span>更多></span></p>
          <div className={styles.questionBox}>
            <div className={styles.questionItem}>
              <div className={styles.Item}><i className={styles.point}></i><span className={styles.questionName}>如何查询/修改我的个人信息?</span></div>
              <div className={styles.Item}><i className={styles.point}></i><span className={styles.questionName}>商户审核不通过怎么办?</span></div>
              <div className={styles.Item}><i className={styles.point}></i><span className={styles.questionName}>如何编辑短信模板?</span></div>
            </div>
            <div className={styles.questionItem}>
              <div className={styles.Item}><i className={styles.point}></i><span className={styles.questionName}>如何查询/修改我的个人信息?</span></div>
              <div className={styles.Item}><i className={styles.point}></i><span className={styles.questionName}>商户审核不通过怎么办?</span></div>
              <div className={styles.Item}><i className={styles.point}></i><span className={styles.questionName}>如何编辑短信模板?</span></div>
            </div>
            <div className={styles.questionItem}>
              <div className={styles.Item}><i className={styles.point}></i><span className={styles.questionName}>如何查询/修改我的个人信息?</span></div>
              <div className={styles.Item}><i className={styles.point}></i><span className={styles.questionName}>商户审核不通过怎么办?</span></div>
              <div className={styles.Item}><i className={styles.point}></i><span className={styles.questionName}>如何编辑短信模板?</span></div>
            </div>
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