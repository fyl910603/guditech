import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Button, Modal, Divider, Table, Tooltip, Icon, Input, message } from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { PictureShow } from 'components/pictureShow';
import { LicenseShow } from 'components/licenseShow';
import { PictureUpload } from 'components/pictureUpload';
import { namespace } from './model';
import { SmsTemplateEdit } from 'components/SmsTemplateEdit';
import { confirm } from 'components/confirm';
import { LinkButton } from 'components/linkButton';
import { MessageBox } from 'components/messageBox';

interface State {
  status: number,
  channelcode: string,
  editvisible: boolean,
  addvisible: boolean,
  imgvisible: boolean,
  currData: object,
  editImgUrl: string,
  addSignName: any,
  addImgUrl: string,
  lookImg: string,
  Path: string
}
interface Props {
  dispatch: (props: any) => void;
  data: any
}
let divForm: HTMLDivElement;
class Component extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      status: 0,
      channelcode: '',
      editvisible: false,
      addvisible: false,
      imgvisible: false,
      currData: {},
      editImgUrl: '',
      addImgUrl: '',
      lookImg: '',
      Path: '',
      addSignName: ''
    };
    this.getSignList()
  }
  componentDidMount() {
    // console.log(this.props)
  }

  componentWillUnmount() {
  }

  getSignList = () => {
    this.props.dispatch({
      type: `${namespace}/fetchSign`,
      payload: {
        status: this.state.status,
        channelcode: this.state.channelcode,
      },
    });
  }
  onSave = (data, container) => {
    this.props.dispatch({
      type: `${namespace}/onSave`,
      payload: {
        container,
        data,
      },
    });
  };
  onSubmit = (e) => {
    this.props.dispatch({
      type: `${namespace}/save`,
      payload: {
        SignId: this.state.currData.SignId,
        editSignName: this.state.currData.SignName,
        editImgUrl: this.state.Path,
        container:this.divForm
      },
    });
    e.preventDefault();
    // this.setState({
    //   editvisible: false,
    // });
  }
  addSave = (e) => {
    this.props.dispatch({
      type: `${namespace}/add`,
      payload: {
        addSignName: this.state.addSignName,
        addImgUrl: this.state.Path,
        container:this.divForm
      },
    });
    e.preventDefault();
    // this.setState({
    //   editvisible: false,
    // });
  }
  handleCancel = (e) => {
    this.props.dispatch({
      type: `${namespace}/showAdd`,
      payload: {
        isShowAdd: false,
      },
    });
    this.props.dispatch({
      type: `${namespace}/showEdit`,
      payload: {
        isShowEdit: false,
      },
    });
    this.setState({
      imgvisible: false,
    });
  }
  onCloseEdit = () => {
    this.props.dispatch({
      type: `${namespace}/showEdit`,
      payload: {
        isShowEdit: false,
      },
    });
  };
  onOpenEdit = record => {
    this.props.dispatch({
      type: `${namespace}/showEdit`,
      payload: {
        isShowEdit: true,
      },
    });
    this.setState({
      currData: record
    })
    setTimeout(() => {
      this.setState({
        editImgUrl: record.LicenceUrl
      })
    }, 50)
  };
  onOpenAdd = () => {
    this.props.dispatch({
      type: `${namespace}/showAdd`,
      payload: {
        isShowAdd: true,
      },
    });
    this.setState({
      addSignName: '',
      addImgUrl:'',
      Path:''
    })
  };
  onOpenImg = (img) => {
    this.setState({
      editvisible: false,
      addvisible: false,
    })
    setTimeout(() => {
      this.setState(
        {
          imgvisible: true,
          lookImg: img

        }
      )
    }, 20)
  };
  onDelete = record => {
    confirm({
      title: '确定要删除该模板吗？',
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/onDelete`,
          payload: record.SignId,
          container:this.divForm
        });
      },
    });
  };
  onSignnameChanged = (e) => {
    this.setState({
      currData: Object.assign(this.state.currData, { SignName: e.target.value })
    })
  }
  onaddSignnameChanged = (e) => {
    this.setState({
      addSignName: e.target.value
    })
  }
  picUpload = (data) => {
    this.setState({
      currData: Object.assign(this.state.currData, { LicenceUrl: data.ImgUrl }),
      Path: data.ImgPath
    })
    setTimeout(() => {
      this.setState({
        editImgUrl: data.ImgUrl,
        addImgUrl: data.ImgUrl
      })
    }, 50)
    // dispatch({
    //   type: `${namespace}/picUpload`,
    //   payload: data,
    // });
  }

  onPicUploadError = (error) => {
    MessageBox.show(error, divForm);
  }
  // const { lastData, currData, isShowLastInfo, isShowEdit } = this.props.data;

  // const canSave = currData.Status === undefined || currData.Status === 1 || currData.Status === 4;

  onOpenLastInfo = () => {
    // dispatch({
    //   type: `${namespace}/showLastInfo`,
    //   payload: true,
    // });
  }
  onCloseLastInfo = () => {
    // dispatch({
    //   type: `${namespace}/showLastInfo`,
    //   payload: false,
    // });
  }
  render() {
    const columns: any = [
      {
        title: '签名',
        dataIndex: 'SignName',
        width: 150,
        align: 'center'
      },
      {
        title: '营业执照',
        dataIndex: 'LicenceUrl',
        width: 150,
        align: 'center',
        render: (text, record) => {
          return (
            <span>
              <span className={styles.textBtn1} onClick={() => this.onOpenImg(record.LicenceUrl)}>查 看</span>
            </span>
          )
        }
      },
      {
        title: '审核状态',
        width: 150,
        dataIndex: 'ExamineStateName',
        align: 'center',
        render: (text, h) => {
          const red = h.Status === 4 || h.Status === 5;
          if (h.Status === 4 || h.Status === 5) {
            return (
              <Tooltip placement="topLeft" title={h.ErrorReason} arrowPointAtCenter>
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
        title: '申请时间',
        dataIndex: 'ApplyTime',
        width: 280,
        align: 'center'
      },
      {
        title: '更新时间',
        dataIndex: 'UpdateTime',
        width: 280,
        align: 'center'
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        align: 'center',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.onOpenEdit(record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.onDelete(record)} style={{ color: 'red' }}>
              删除
            </a>
          </span>
        ),
      },
    ];
    const statusMap = {
      1: '等待审核',
      2: '审核中',
      3: '认证成功',
      4: '认证失败',
      5: '无效',
    };
    const { signList, isShowEdit, currData,isShowAdd } = this.props.data
    const canSave = currData.Status === undefined || currData.Status === 1 || currData.Status === 4;
    const listData = signList.map(h => ({
      ...h,
      ExamineStateName: statusMap[h.Status],
    }));
    let table
    if (signList.length > 0) {
      table = <Table
        columns={columns}
        dataSource={listData}
        pagination={false}
        // scroll={{ y: height }}
        bordered={true}
        rowKey="SignId"
        locale={{
          emptyText: '暂无客户数据',
        }}
      />
    }
    return (
      <div className={styles.page} ref={obj => (this.divForm = obj)}>
        <div className={styles.hintBox}>
          <span className={styles.hint}>您可以通过短信方式与目标客户建立更精准、快捷的连接，大大降低拓客成本.点击此处</span><span className={styles.textBtn} onClick={() => { this.onOpenAdd() }}>申请短信业务</span>
        </div>
        <div className={styles.divTable}>
          {signList.length > 0 ? table : ''}
        </div>
        {/* <SplitPage
          pageIndex={pageindex}
          total={totalCount}
          pageSize={pagecount}
          onPageChanged={this.onPageChanged}
        /> */}
        {/* 编辑短信业务 */}
        {isShowEdit && (
          <Modal title="编辑短信业务" visible={true}
            style={{ top: 200 }}
            width='630px'
            onCancel={this.handleCancel}
            footer={[
              <Button key="submit" type="primary" size="large" onClick={this.onSubmit}>
                提交
                    </Button>,
              <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            ]}
          >
            <div className={styles.form}>
              <Form>
                <FormItem title="签名：" thWidth={120}>
                  <Input
                    onChange={this.onSignnameChanged}
                    defaultValue={this.state.currData.SignName}
                    maxLength={12}
                    placeholder="请输入签名信息"
                  />
                </FormItem>
                <FormItem title="营业执照：">
                  <div className={styles.picItem}>
                    <PictureShow type={2} url={this.state.editImgUrl} />
                    <PictureUpload
                      onSuccess={this.picUpload}
                      onError={this.onPicUploadError}
                      type={2}
                      title="上传营业执照"
                    />
                  </div>
                </FormItem>
                <FormItem>
                </FormItem>
              </Form>
            </div>
          </Modal>
        )}
        {/* 新增短信业务 */}
        {isShowAdd && <Modal title="创建短信业务" visible={true}
          style={{ top: 200 }}
          width='630px'
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.addSave}>
              提交
            </Button>,
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
          ]}
        >
          <div className={styles.form}>
            <Form>
              <FormItem title="签名：" thWidth={120}>
                <Input
                  onChange={this.onaddSignnameChanged}
                  defaultValue={this.state.addSignName}
                  maxLength={12}
                  placeholder="请输入签名信息"
                />
              </FormItem>
              <FormItem title="营业执照：">
                <div className={styles.picItem}>
                  <PictureShow type={2} url={this.state.addImgUrl} />
                  <PictureUpload
                    onSuccess={this.picUpload}
                    onError={this.onPicUploadError}
                    type={2}
                    title="上传营业执照"
                  />
                </div>
              </FormItem>
              <FormItem>
              </FormItem>
            </Form>
          </div>
        </Modal>}
        <Modal title="查看营业执照" visible={this.state.imgvisible}
          style={{ top: 100 }}
          width='630px'
          onCancel={this.handleCancel}
          footer={null}
        >
          <LicenseShow type={1} url={this.state.lookImg} />
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
