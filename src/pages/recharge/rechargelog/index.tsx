import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, DatePicker, Select } from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';

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
      type: `${namespace}/fetchPayType`,
      payload: {},
    });
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
      height: this.divForm.offsetHeight - 55 - 80 - 70,
    });
  };

  onDateChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onDateChanged`,
      payload: e,
    });
  };
  onPayTypeChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onPayTypeChanged`,
      payload: e,
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

  render() {
    const { list, paymentTypeList, totalCount, pageindex, pagecount, timeRange, paytypecode } = this.props.data;
    const { height } = this.state;

    const columns: any = [
      {
        title: '充值号码',
        dataIndex: 'UserName',
        width: 150,
        align:'center',
      },
      {
        title: '充值金额',
        dataIndex: 'GoodsName',
        width: 150,
        align:'center',
      },
      {
        title: '充值方式',
        dataIndex: 'PayTypeName',
        align:'center',
        width: 150,
      },
      {
        title: '订单编号',
        dataIndex: 'OrderSN',
        align:'center',
        width: 200,
      },
      {
        title: '充值时间',
        dataIndex: 'RechargeTime',
        align:'center',
      },
      {
        title: '充值状态',
        dataIndex: 'RechargeStateName',
        align:'center',
        width: 150,
      },
    ];

    const statusMap = {
      1: '支付成功',
      2: '充值成功',
      3: '退款中',
      4: '退款成功',
    };

    const listData = list.map(h => ({
      ...h,
      RechargeStateName: statusMap[h.RechargeState],
    }));

    return (
      <div className={styles.main} ref={obj => (this.divForm = obj)}>
        <div className={styles.condition}>
          <div className={styles.title}>时间范围：</div>
          <DatePicker.RangePicker onChange={this.onDateChanged} value={timeRange} />
          <div className={styles.title}>支付方式：</div>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="请选择"
            optionFilterProp="children"
            defaultValue=""
            onChange={this.onPayTypeChanged}
            value={paytypecode}
          >
            <Select.Option value="" key="">
              全部
            </Select.Option>
            {paymentTypeList.map(h => (
              <Select.Option value={h.TypeCode} key={h.TypeCode}>
                {h.Name}
              </Select.Option>
            ))}
          </Select>
          <Button ghost type="primary" className={styles.btn} onClick={this.onSelect}>
            搜索
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={listData}
          pagination={false}
          scroll={{ y: height }}
          rowKey="OrderSN"
          className={styles.divTable}
          bordered={true}
        />
        <SplitPage pageIndex={pageindex} total={totalCount} pageSize={pagecount} onPageChanged={this.onPageChanged} />
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
