import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, DatePicker } from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';
import router from 'umi/router';
import { toFixed2 } from 'utils/util';

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

  render() {
    const { list, totalCount, pageindex, pagecount, timeRange } = this.props.data;
    const { height } = this.state;

    list.map(item => {
      item.PreBasicMoneyStr = toFixed2(item.PreBasicMoney / 100);
      item.CurBasicMoneyStr = toFixed2(item.CurBasicMoney / 100);
      item.ChangeBasicMoneyStr = toFixed2(item.ChangeBasicMoney / 100);

      if (item.ChangeBasicMoney > 0) {
        item.ChangeBasicMoneyStr = '+' + item.ChangeBasicMoneyStr;
      }
    });

    const columns: any = [
      {
        title: '变更前金额（元）',
        dataIndex: 'PreBasicMoneyStr',
        width: 170,
        align: 'center',
      },
      {
        title: '变更后金额（元）',
        dataIndex: 'CurBasicMoneyStr',
        align: 'center',
        width: 170,
      },
      {
        title: '变更金额',
        dataIndex: 'ChangeBasicMoneyStr',
        width: 170,
        align: 'center',
      },
      {
        title: '变更原因',
        dataIndex: 'Description',
        align: 'center',
      },
      {
        title: '变更时间',
        dataIndex: 'Time',
        width: 190,
        align: 'center',
      },
    ];

    return (
      <div className={styles.main} ref={obj => (this.divForm = obj)}>
        <div className={styles.condition}>
          <div className={styles.title}>时间范围：</div>
          <DatePicker.RangePicker onChange={this.onDateChanged} value={timeRange} />
          <Button ghost type="primary" className={styles.btn} onClick={this.onSelect}>
            搜索
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          pagination={false}
          scroll={{ y: height }}
          rowKey="Id"
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
