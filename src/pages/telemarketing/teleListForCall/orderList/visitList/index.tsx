import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table } from 'antd';
import { namespace } from './model';
import { SplitPage } from 'components/splitPage';
import { ShortMessageVisitDetail } from 'components/shortMessageVisitDetail';

interface Props {
  dispatch: (props: any) => void;
  data: any;
}

interface State {
  height: number;
}

const stateMap = {
  false: '未验证',
  true: '已验证',
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

  onPageChanged = (pageindex, pagecount) => {
    this.props.dispatch({
      type: `${namespace}/fetch`,
      payload: {
        pageindex,
        container: this.divForm,
      },
    });
  };

  onShowDetail = h => {
    this.props.dispatch({
      type: `${namespace}/onShowDetail`,
      payload: {
        container: this.divForm,
        jumpId: h.JumpId,
      },
    });
  };

  onCloseDetail = () => {
    this.props.dispatch({
      type: `${namespace}/onCloseDetail`,
      payload: {},
    });
  };

  render() {
    const { list, totalCount, pageindex, pagecount, isShowDetail, detailData } = this.props.data;
    const { height } = this.state;
    const columns: any[] = [
      {
        title: '手机号码',
        dataIndex: 'Phone',
        width: 200,
        align: 'center',
      },
      {
        title: '访问次数',
        dataIndex: 'VisitCount',
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        width: 70,
        align: 'center',
        render: (text, h) => (
          <span>
            {!h.IsChecked && (
              <a href="javascript:;" onClick={() => this.onShowDetail(h)}>
                明细
              </a>
            )}
          </span>
        ),
      },
    ];

    return (
      <div className={styles.main} ref={obj => (this.divForm = obj)}>
        <Table
          columns={columns}
          dataSource={list}
          pagination={false}
          scroll={{ y: height }}
          rowKey="JumpId"
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

        {isShowDetail && <ShortMessageVisitDetail onClose={this.onCloseDetail} data={detailData} />}
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
