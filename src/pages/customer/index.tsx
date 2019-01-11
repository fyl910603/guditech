import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, Divider } from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';
import { CustomerEdit } from 'components/customerEdit';
import { confirm } from 'components/confirm';
import { Input2 } from 'components/input';

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
      height: 10,
    };
  }

  onNameChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onNameChanged`,
      payload: e.target.value,
    });
  };

  onMobileChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onMobileChanged`,
      payload: e.target.value,
    });
  };

  onDetailAddressChanged = e => {
    this.props.dispatch({
      type: `${namespace}/onDetailAddressChanged`,
      payload: e.target.value,
    });
  };

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
      height: this.divForm.offsetHeight - 55 - 80 - 70,
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

  onSave = (data, container) => {
    this.props.dispatch({
      type: `${namespace}/onSave`,
      payload: {
        container,
        data,
      },
    });
  };

  onDelete = record => {
    confirm({
      title: '确定要删除该客户资料吗？',
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/onDelete`,
          payload: record.Id,
        });
      },
    });
  };

  render() {
    const {
      ChildsName,
      Mobile,
      DetailAddress,
      list,
      totalCount,
      pageindex,
      pagecount,
      isShowEdit,
      currData,
    } = this.props.data;
    const { height } = this.state;
    const columns: any = [
      {
        title: '姓名',
        dataIndex: 'ChildsName',
        width: 150,
        align:'center'
      },
      {
        title: '电话',
        dataIndex: 'Mobile',
        width: 150,
        align:'center'
      },
      {
        title: '地址',
        dataIndex: 'DetailAddress',
        align:'center'
      },
      {
        title: '时间',
        dataIndex: 'Time',
        width: 280,
        align:'center'
      },
      {
        title: '操作',
        key: 'action',
        width: 110,
        align:'center',
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
        <div className={styles.condition}>
          <div className={styles.title}>姓名：</div>
          <Input2 onChange={this.onNameChanged} value={ChildsName} />
          <div className={styles.title}>手机号码：</div>
          <Input2 onChange={this.onMobileChanged} value={Mobile} />
          <div className={styles.title}>地址：</div>
          <Input2 onChange={this.onDetailAddressChanged} value={DetailAddress} />

          <Button ghost type="primary" className={styles.btn} onClick={this.onSelect}>
            搜索
          </Button>
        </div>
        <div className={styles.divTable}>
          <Table
            columns={columns}
            dataSource={list}
            pagination={false}
            scroll={{ y: height }}
            bordered={true}
            rowKey="Id"
            locale={{
              emptyText: '暂无客户数据',
            }}
          />
        </div>
        <SplitPage
          pageIndex={pageindex}
          total={totalCount}
          pageSize={pagecount}
          onPageChanged={this.onPageChanged}
        />
        {isShowEdit && (
          <CustomerEdit data={currData} onSave={this.onSave} onClose={this.onCloseEdit} />
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
