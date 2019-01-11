import * as React from 'react';
import styles from './styles.less';
import { Modal, Table } from 'antd';
import { Button } from 'antd';
import { Input2 } from 'components/input';
import { Form } from 'components/form';
import { FormItem } from 'components/formItem';
import { TextArea2 } from 'components/textArea';

export interface Props {
  onClose: () => void;
  data: any;
}

export class ShortMessageVisitDetail extends React.PureComponent<Props> {
  private divForm: HTMLDivElement;
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    const { data } = this.props;
  }

  onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  render() {
    const { data = [] } = this.props;

    const columns: any[] = [
      {
        title: '设备信息',
        dataIndex: 'UA',
        align: 'center',
      },
      {
        title: '访问地址',
        dataIndex: 'Ip',
        align: 'center',
        width: 180,
      },
      {
        title: '创建时间',
        dataIndex: 'VisitTime',
        align: 'center',
        width: 200,
      },
    ];

    return (
      <div className={styles.main}>
        <Modal
          title={'访问明细'}
          visible={true}
          className={styles.modal}
          onCancel={this.onClose}
          centered={true}
          width={800}
          footer={
            <div className="divBtn">
              <Button type="primary" onClick={this.onClose}>
                关闭
              </Button>
            </div>
          }
        >
          <div ref={obj => (this.divForm = obj)} className={styles.divContent}>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              scroll={{ y: 300 }}
              rowKey="Id"
              bordered={true}
              locale={{
                emptyText: '暂无记录',
              }}
            />
          </div>
        </Modal>
      </div>
    );
  }
}
