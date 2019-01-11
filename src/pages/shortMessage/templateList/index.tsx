import * as React from 'react';
import { connect } from 'dva';
import styles from './styles.less';
import { Table, Divider, Icon, Tooltip } from 'antd';
import { namespace } from './model';
import Button from 'antd/es/button';
import { SplitPage } from 'components/splitPage';
import { ShortMessageTemplateEdit } from 'components/shortMessageTemplateEdit';
import { confirm } from 'components/confirm';

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
      title: '确定要删除该模板吗？',
      onOk: () => {
        this.props.dispatch({
          type: `${namespace}/onDelete`,
          payload: record.TemplateSysId,
        });
      },
    });
  };

  render() {
    const { list, totalCount, pageindex, pagecount, isShowEdit, currData } = this.props.data;
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
        width: '40%',
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
        width: '12%',
        align: 'center',
        render: (text, h) => (
          <span>
            {(h.ExamineState === 1 || h.ExamineState === 2 || h.ExamineState === 3) && (
              <React.Fragment>
                <a href="javascript:;" onClick={() => this.onOpenEdit(h)}>
                  编辑
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
            data={currData}
            onSave={this.onSave}
            onClose={this.onCloseEdit}
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
