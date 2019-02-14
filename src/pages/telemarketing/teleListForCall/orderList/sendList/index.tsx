import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, Divider, Icon, DatePicker, Select } from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';
import router from 'umi/router';
import { confirm } from 'components/confirm';
import { Input2 } from 'components/input';
import { ShortMessageSendConfirm } from 'components/shortMessageSendConfirm';
import { ShortMessageCheck } from 'components/shortMessageCheck';

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
      height: this.divForm.offsetHeight - 55 - 100,
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

  onCheck = h => {
    this.props.dispatch({
      type: `${namespace}/onCheck`,
      payload: {
        container: this.divForm,
        id: h.Id,
      },
    });
  };

  onCloseCheck = () => {
    this.props.dispatch({
      type: `${namespace}/onCloseCheck`,
      payload: {},
    });
  };

  render() {
    const {
      list,
      totalCount,
      pageindex,
      pagecount,
      isShowCheck,
      checkData,
      totalSendCount,
      currSendCount,
      checkedCount,
      remainCheckCount,
      contentTypeList,
    } = this.props.data;
    const { height } = this.state;

    const fields = [];

    contentTypeList.map(h => {
      fields.push({
        title: h.ContentTypeDes,
        dataIndex: h.ContentType,
        align: 'center',
        width: 100,
      });
    });

    list.map(h => {
      h.CheckedState = stateMap[h.IsChecked];
      contentTypeList.map(c => {
        h[c.ContentType] = h.List.filter(i => i.ContentType === c.ContentType)[0].ContentValue;
      });
    });

    const columns: any[] = [
      {
        title: '手机号码',
        dataIndex: 'Mobile',
        width: 110,
        align: 'center',
      },
      {
        title: '孩子姓名',
        dataIndex: 'Name',
        align: 'center',
      },
    ];
    columns.push(...fields);
    columns.push(
      ...[
        {
          title: '验证状态',
          dataIndex: 'CheckedState',
          width: 80,
          align: 'center',
        },
        {
          title: '发送时间',
          dataIndex: 'SendTime',
          width: 160,
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
                <a href="javascript:;" onClick={() => this.onCheck(h)}>
                  验证
                </a>
              )}
            </span>
          ),
        },
      ]
    );

    return (
      <div className={styles.main} ref={obj => (this.divForm = obj)}>
        <div className={styles.info}>
          <div className={styles.left}>
            <div>发送数量：{totalSendCount}</div>
            <div>成功数量：{currSendCount}</div>
          </div>
          <div className={styles.right}>
            <div>验证信息条数：{checkedCount + remainCheckCount}条</div>
            <div>已验证：{checkedCount}条</div>
            <div>剩余验证条数：{remainCheckCount}条</div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          onRow={(record: any) => {
            return {
              style: {
                backgroundColor: record.IsChecked === true ? '#f5fcf4': ''
              }
            };
          }}
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

        {isShowCheck && <ShortMessageCheck onClose={this.onCloseCheck} data={checkData} />}
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
