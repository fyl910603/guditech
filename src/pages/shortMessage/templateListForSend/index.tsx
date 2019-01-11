import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, Icon } from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';
import { ShortMessageTemplateEdit } from 'components/shortMessageTemplateEdit';
import router from 'umi/router';

interface Props {
  dispatch: (props: any) => void;
  data: any;
}

interface State {
  height: number;
}

class Component extends React.PureComponent<Props, State> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      height: 0,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: `${namespace}/fetch`,
      payload: {
        container: this.divForm,
      },
    });

    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
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

  onSend = d => {
    router.push(`/shortMessage/templateListForSend/send?id=${d.TemplateSysId}`);
  };

  onOpenOrderList = record => {
    router.push(`/shortMessage/templateListForSend/orderList?clear=1`);
  };

  onGotoAddTemplate = () => {
    router.push('/shortMessage/templateList');
  };

  render() {
    const { list, totalCount, pageindex, pagecount, isShowEdit, currData } = this.props.data;
    const { height } = this.state;
    const columns: any = [
      {
        title: '短信名字',
        dataIndex: 'TemplateName',
        width: 90,
        align: 'center',
      },
      {
        title: '短信内容',
        dataIndex: 'SmsContent',
        width: 280,
        align: 'center',
      },
      {
        title: '短信链接',
        dataIndex: 'SmsLink',
        align: 'center',
      },
      {
        title: '最近发送时间',
        dataIndex: 'LastSendTime',
        width: 120,
        align: 'center',
      },
      {
        title: '提交时间',
        dataIndex: 'CreateTime',
        width: 120,
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        width: 190,
        align: 'center',
        // fixed: 'right',
        render: (text, h) => (
          <span>
            {
              <React.Fragment>
                <div className={styles.option}>
                  <a href="javascript:;" onClick={() => this.onSend(h)}>
                    <div className={styles.send}>
                      <Icon type="mail" />
                      发送短信
                    </div>
                  </a>
                  <br />
                  <a href="javascript:;" onClick={() => this.onOpenEdit(h)}>
                    模板详情
                  </a>
                </div>
              </React.Fragment>
            }
          </span>
        ),
      },
    ];

    return (
      <div className={styles.main} ref={obj => (this.divForm = obj)}>
        <Button
          className={styles.btnOrder}
          ghost
          type="primary"
          onClick={() => this.onOpenOrderList(null)}
        >
          订单记录
        </Button>
        <Table
          columns={columns}
          dataSource={list}
          pagination={false}
          scroll={{ y: height }}
          rowKey="TemplateSysId"
          bordered={true}
          locale={{
            emptyText: '暂无短信内容模板，请前往短信模板创建',
          }}
        />
        <SplitPage
          pageIndex={pageindex}
          total={totalCount}
          pageSize={pagecount}
          onPageChanged={this.onPageChanged}
        />

        {totalCount < 1 && (
          <Button
            onClick={this.onGotoAddTemplate}
            className={styles.btnAddTemplate}
            type="primary"
            ghost
          >
            立即创建
          </Button>
        )}

        {isShowEdit && (
          <ShortMessageTemplateEdit isEdit={false} data={currData} onClose={this.onCloseEdit} />
        )}
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
