import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, DatePicker } from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';
import router from 'umi/router';
import { confirm } from 'components/confirm';
import { Input2 } from 'components/input';
import { ShortMessageSendConfirm } from 'components/shortMessageSendConfirm';

interface Props {
  dispatch: (props: any) => void;
  data: any;
}

interface State {
  height: number;
}

const stateMap = {
  1: '待发送',
  2: '正在发送',
  3: '商户取消发送',
  4: '发送已完成',
  5: '订单被无效',
};

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
      height: this.divForm.offsetHeight - 55 - 80 - 50,
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

  onDateChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onDateChanged`,
      payload: e,
    });
  };

  onTemplateNameChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onTemplateNameChanged`,
      payload: e.target.value,
    });
  };

  onCancelSend = h => {
    confirm({
      title: '确定要取消短信发送吗？',
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/onCancelSend`,
          payload: h.OrderId,
        });
      },
    });
  };
  onOpenDetail = h => {
    this.props.dispatch({
      type: `${namespace}/onOpenDetail`,
      payload: h.OrderId,
    });
  };
  onCloseDetail = () => {
    this.props.dispatch({
      type: `${namespace}/onCloseDetail`,
      payload: {},
    });
  };
  onOrderSnChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onOrderSnChanged`,
      payload: e.target.value,
    });
  };
  onOpenSendDetail = h => {
    router.push(`/shortMessage/templateListForSend/orderList/sendList?orderId=${h.OrderId}&clear=1`);
  };
  onOpenReadDetail = h => {
    router.push(`/shortMessage/templateListForSend/orderList/visitList?orderId=${h.OrderId}&clear=1`);
  };

  render() {
    const {
      list,
      totalCount,
      pageindex,
      pagecount,
      timeRange,
      templateName,
      orderSn,
      isShowDetail,
      orderDetail,
    } = this.props.data;
    const { height } = this.state;
    const columns: any = [
      {
        title: '订单号码',
        dataIndex: 'OrderSn',
        width: 170,
        align: 'center',
      },
      {
        title: '模板名称',
        dataIndex: 'ContentTemlateName',
        align: 'center',
      },
      {
        title: '发送数量',
        dataIndex: 'SmsSendTotalCount',
        width: 100,
        align: 'center',
      },
      {
        title: '成功数量',
        dataIndex: 'SmsSendSuccessCount',
        width: 100,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'Status',
        width: 110,
        align: 'center',
        render: (text, h) => {
          return stateMap[h.Status]
        },
      },
      {
        title: '发送时间',
        dataIndex: 'SmsSendTime',
        width: 120,
        align: 'center',
      },
      {
        title: '完成时间',
        dataIndex: 'FinishTime',
        width: 120,
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        width: 90,
        align: 'center',
        render: (text, h) => (
          <span>
            {
              <React.Fragment>
                {h.Status === 1 && (
                  <React.Fragment>
                    <a href="javascript:;" onClick={() => this.onCancelSend(h)}>
                      取消发送
                    </a>
                    <br />
                  </React.Fragment>
                )}
                <a href="javascript:;" onClick={() => this.onOpenDetail(h)}>
                  订单详情
                </a>
                <br />
                {(h.Status === 2 || h.Status === 4) && (
                  <React.Fragment>
                    <a href="javascript:;" onClick={() => this.onOpenSendDetail(h)}>
                      发送详情
                    </a>
                    <br />
                  </React.Fragment>
                )}
                {h.Status === 4 && (
                  <a href="javascript:;" onClick={() => this.onOpenReadDetail(h)}>
                    访问详情
                  </a>
                )}
              </React.Fragment>
            }
          </span>
        ),
      },
    ];

    return (
      <div className={styles.main} ref={obj => (this.divForm = obj)}>
        <div className={styles.condition}>
          <div className={styles.title}>时间范围：</div>
          <DatePicker.RangePicker onChange={this.onDateChanged} value={timeRange} />
          <div className={styles.title}>模板名字：</div>
          <Input2
            placeholder="模板名称"
            value={templateName}
            onChange={this.onTemplateNameChanged}
          />
          <div className={styles.title}>订单号码：</div>
          <Input2 placeholder="订单号码" value={orderSn} onChange={this.onOrderSnChanged} />
          <Button ghost type="primary" className={styles.btn} onClick={this.onSelect}>
            搜索
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          pagination={false}
          scroll={{ y: height }}
          rowKey="OrderId"
          bordered={true}
          locale={{
            emptyText: '暂无记录',
          }}
        />
        <SplitPage
          pageIndex={pageindex}
          total={totalCount}
          pageSize={pagecount}
          onPageChanged={this.onPageChanged}
        />

        {isShowDetail && (
          <ShortMessageSendConfirm
            onClose={this.onCloseDetail}
            data={orderDetail}
            doType="detail"
          />
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
