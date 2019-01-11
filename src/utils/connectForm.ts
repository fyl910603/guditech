import { connect } from 'dva';
import Form from 'antd/es/form';

export function connectForm(EditComponent: any, actionType: string) {
  let EditComponentForm = Form.create()(EditComponent);

  return connect(({ mapStateToProps, mapDispatchToProps }) => ({
    mapStateToProps,
    mapDispatchToProps,
  }))(EditComponentForm);
}
