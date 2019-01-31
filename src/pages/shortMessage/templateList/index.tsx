import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, Divider, Icon, Tooltip,Modal,Select, Form, Input} from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';
import { ShortMessageTemplateEdit } from 'components/shortMessageTemplateEdit';
import { confirm } from 'components/confirm';
import { FormItem } from 'components/formItem';

interface Props {
  dispatch: (props: any) => void;
  data: any;
}

interface State {
  height: number;
  editvisible:boolean;
  temvisible:boolean;
  defaultSignName:string;
  editSignId:string;
  edittemplateid:string;
  templateName:string;
}

class Component extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      templateName:'',
      height: 0,
      editvisible:false,
      temvisible:false,
      defaultSignName:'',
      editSignId:'',
      edittemplateid:''
    };
  }

  componentDidMount() {
    // this.props.dispatch({
    //   type: `${namespace}/fetch`,
    //   payload: {
    //     container: this.divForm,
    //   },
    // });
    //   this.props.dispatch({
    //     type: `${namespace}/fetchType`,
    //     payload: {
    //       container: this.divForm,
    //       status: 1,
    //     },
    //   });
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    // this.props.dispatch({
    //   type: `${namespace}/fetch`,
    //   payload: {
    //     container: this.divForm,
    //   },
    // });
    //   this.props.dispatch({
    //     type: `${namespace}/fetchType`,
    //     payload: {
    //       container: this.divForm,
    //       status: 1,
    //     },
    //   });
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.setState({
      height: this.divForm.offsetHeight - 55 - 80,
    });
  };

  onSelect = e => {
    this.props.dispatch({
      type: `${namespace}/fetch`,
      payload: {
        container: this.divForm,
        pageindex: 1,
      },
    });
  };
  handleCancel = (e) => {
    this.setState({
      editvisible: false,
      temvisible:false,
      defaultSignName:''
    });
  }
  onChangeTName = (e)=>{
    this.setState({
      templateName: e.target.value,
    });
  }
  onOpenMEdit = record => {
      this.setState({
        defaultSignName:record.SignId,
        edittemplateid:record.TemplateSysId,
        editSignId:record.SignId
      })
      setTimeout(()=>{
        this.setState({
          editvisible:true,
        })
      },50)
  };
  onOpenTEdit = record => {
    this.setState({
      templateName:record.TemplateName,
      edittemplateid:record.TemplateSysId,
    })
    setTimeout(()=>{
      this.setState({
        temvisible:true,
      })
    },50)
};
  onPageChanged = (pageindex, pagecount) => {
    this.props.dispatch({
      type: `${namespace}/fetch`,
      payload: {
        pageindex,
        container: this.divForm,
      },
    });
  };

  onOpenEdit = record => {
    this.props.dispatch({
      type: `${namespace}/showEdit`,
      payload: {
        currData: record,
        isShowEdit: true,
      },
    });
  };

  onCloseEdit = () => {
    this.props.dispatch({
      type: `${namespace}/showEdit`,
      payload: {
        isShowEdit: false,
      },
    });
  };

  onSave = (data, container) => {
    this.props.dispatch({
      type: `${namespace}/onSave`,
      payload: {
        container,
        data,
      },
    });
  };
  handleChange = value =>{
    this.setState({
      editSignId:value,
    })
  }
  // 修改模板名称
  saveTemplate = (container) =>{
    this.props.dispatch({
      type: `${namespace}/onEditTem`,
      payload: {
        container,
        templateid:this.state.edittemplateid,
        templatename:this.state.templateName
      },
    });
    this.setState({
      temvisible : false
    })
  }
  saveSign = (container) =>{
    this.props.dispatch({
      type: `${namespace}/onEdit`,
      payload: {
        container,
        templateid:this.state.edittemplateid,
        signid:this.state.editSignId
      },
    });
    this.setState({
      editvisible : false
    })
  }
  onDelete = record => {
    confirm({
      title: '确定要删除短信模板吗？',
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/onDelete`,
          payload: record.TemplateSysId,
        });
      },
    });
  };

  render() {
    const { list, typelist, totalCount, pageindex, pagecount, isShowEdit,isShowSign, currData } = this.props.data;
    const { height } = this.state;
    const columns: any = [
      {
        title: '短信名字',
        dataIndex: 'TemplateName',
        width: '10%',
        align: 'center',
      },
      {
        title: '短信内容',
        dataIndex: 'SmsContent',
        width: '30%',
        align: 'center',
      },
      {
        title: '短信链接',
        dataIndex: 'SmsLink',
        width: '14%',
        align: 'center',
      },
      {
        title: '审核状态',
        dataIndex: 'ExamineStateName',
        width: '12%',
        align: 'center',
        render: (text, h) => {
          const red = h.ExamineState === 2 || h.ExamineState === 3 || h.ExamineState === 5;
          if (h.ExamineFailReason) {
            return (
              <Tooltip placement="topLeft" title={h.ExamineFailReason} arrowPointAtCenter>
                <span style={{ color: red ? 'red' : '' }}>
                  {h.ExamineStateName}
                  <Icon type="question-circle" />
                </span>
              </Tooltip>
            );
          } else {
            return <span style={{ color: red ? 'red' : '' }}>{h.ExamineStateName}</span>;
          }
        },
      },
      {
        title: '提交时间',
        dataIndex: 'CreateTime',
        width: '12%',
        align: 'center',
      },
      {
        title: '短信编辑',
        key: 'action',
        width: '22%',
        align: 'center',
        render: (text, h) => (
          <span>
            {(h.ExamineState === 1 || h.ExamineState === 3) && (
              <React.Fragment>
                <a href="javascript:;" onClick={() => this.onOpenEdit(h)}>
                  编辑短信内容
                </a>
                <Divider type="vertical" />
              </React.Fragment>
            )}
            {(h.ExamineState !== 5) && (
              <React.Fragment>
                <a href="javascript:;" onClick={() => this.onOpenMEdit(h)}>
              修改签名
              </a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.onOpenTEdit(h)}>
                修改模板名称
              </a>
              <Divider type="vertical" />
              </React.Fragment>
            )}
            <a href="javascript:;" onClick={() => this.onDelete(h)} style={{ color: 'red' }}>
              删除
            </a>
          </span>
        ),
      },
    ];

    const statusMap = {
      1: '待审核',
      2: '审核中',
      3: '审核拒绝',
      4: '审核通过',
      5: '管理员作废',
    };

    const listData = list.map(h => ({
      ...h,
      ExamineStateName: statusMap[h.ExamineState],
    }));
    return (
      <div className={styles.main} ref={obj => (this.divForm = obj)}>
        <Button
          className={styles.btnAdd}
          ghost
          type="primary"
          onClick={() => this.onOpenEdit(null)}
        >
          添加
        </Button>
        <Table
          columns={columns}
          dataSource={listData}
          pagination={false}
          scroll={{ y: height }}
          rowKey="TemplateSysId"
          bordered={true}
          locale={{
            emptyText: '暂无短信模板，请先去添加',
          }}
        />
        <SplitPage
          pageIndex={pageindex}
          total={totalCount}
          pageSize={pagecount}
          onPageChanged={this.onPageChanged}
        />

        {isShowEdit && (
          <ShortMessageTemplateEdit
            isEdit={true}
            typelist={typelist}
            data={currData}
            onSave={this.onSave}
            onClose={this.onCloseEdit}
          />
        )}
        <Modal title="修改签名" visible={this.state.editvisible}
          style={{ top: 200}}
          width='630px'
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.saveSign}>
              提交
            </Button>,
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          ]}
        >
          <div className={styles.form}>
           <Form>
            <span>签名：</span>
              <Select value={this.state.defaultSignName} style={{ width: 300 }} onChange={this.handleChange} >
                {typelist.map((item,index) =>(
                  <Select.Option key={item.SignId} value={item.SignId}>{item.SignName}</Select.Option>
                ))}
              </Select>
          </Form>
        </div>
        </Modal>
        {/* 修改模板名称 */}
        <Modal title="修改模板名称" visible={this.state.temvisible}
          style={{ top: 200}}
          width='630px'
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.saveTemplate}>
              提交
            </Button>,
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          ]}
        >
          <div className={styles.form}>
           <Form>
            <Form.Item label="模板名称：">
              <Input className={styles.lineInput} value={this.state.templateName} onChange={this.onChangeTName} placeholder="请输入模板名称"  />
            </Form.Item>
          </Form>
        </div>
        </Modal>
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
