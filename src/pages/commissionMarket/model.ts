import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { modalSuccess } from 'components/modal';
import { pageSize } from "utils/pageSize";

export const namespace = 'smsTemplate';

export default {
  namespace,
  state: {
    list: [],
    typelist:[],
    pageindex: 1,
    pagecount: pageSize,
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        // if (location.pathname === `/shortMessage/${namespace}`) {
          dispatch({
            type: 'init',
          });
          dispatch({
            type: 'fetch',
            payload: {
              Status: 0,
              DelegateName:''
            },
          });
          dispatch({
            type: 'fetchType',
            payload: {
            },
          });
        // }
      });
    }
  },

  effects: {
    // 查询
    *fetch({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container } = payload;
      const pars: Props = {
        url: '/api/callcenter/delegate/list',
        body: {
          DelegateName:state.delegateName,
          Status:state.delegateStatus,
          pageindex: payload.pageindex || state.pageindex,
          pagecount: state.pagecount,
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchSuccess',
          payload: {
            ...res.data,
            pageindex: payload.pageindex || state.pageindex,
            pagecount: state.pagecount,
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    // 获取签名类型
    *fetchType({ payload }, { put, call, select }) {
      const {container } = payload;
      const state = yield select(state => state[namespace]);
      const channelcode = state.list.length>0 ? state.list[0].ChannelCode : ''
      const pars: Props = {
        url: '/api/smssend/sign/list',
        body: {
          status: payload.status,
          channelcode:channelcode
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({ type: 'fetchTypeSuccess', payload:{typeList:res.data}});
      } else {
        MessageBox.show(res.message, container);
      }
    },
    // 修改模板名称
    *onEditTem({ payload }, { put, call, select }) {
      const {container } = payload;
      const state = yield select(state => state[namespace]);
      const pars: Props = {
        url: '/api/template/content/name/modify',
        body: {
          templateid: payload.templateid,
          delegateName: payload.delegateName,
        },
        method: 'PUT',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetch',
          payload: {},
        });
        yield put({
          type: 'showSignEdit',
          payload: {
            isShowSign: false,
          },
        });
        modalSuccess({
          message: '模板名称修改成功!',
        });
        
      } else {
        MessageBox.show(res.message, container);
      }
    },
    // 修改签名类型
    *onEdit({ payload }, { put, call, select }) {
      const {container } = payload;
      const state = yield select(state => state[namespace]);
      const pars: Props = {
        url: '/api/template/content/sign/modify',
        body: {
          templateid: payload.templateid,
          signid: payload.signid,
        },
        method: 'PUT',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetch',
          payload: {},
        });
        yield put({
          type: 'showSignEdit',
          payload: {
            isShowSign: false,
          },
        });
        modalSuccess({
          message: '签名修改成功!',
        });
        
      } else {
        MessageBox.show(res.message, container);
      }
    },
    // 保存
    *onSave({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container, data } = payload;
      let url = '/api/callcenter/delegate/add';

      if (state.currData) {
        url = '/api/callcenter/delegate/modify';
        data.Id = state.currData.Id;
      }

      const pars: Props = {
        url,
        body: data,
        method:'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetch',
          payload: {},
        });
        yield put({
          type: 'showEdit',
          payload: {
            isShowEdit: false,
          },
        });
        modalSuccess({
          message: '委托活动添加成功',
        });
        
      } else {
        MessageBox.show(res.message, container);
      }
    },
    // 修改委托状态
    *changeStatus({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container, data } = payload;
      const pars: Props = {
        url: '/api/callcenter/delegate/status/modify',
        body: {
          Id: payload.Id,
          Status: payload.Status,
          Description:''
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          message: '状态修改成功!',
        });
        yield put({
          type: 'fetch',
          payload: {},
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    *onDelete({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container, data } = payload;
      const pars: Props = {
        url: '/api/callcenter/delegate/delete',
        body: {
          Id: payload,
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          message: '删除成功!',
        });
        yield put({
          type: 'fetch',
          payload: {},
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
  },

  reducers: {
    init(state, { payload }) {
      return {
        ...state,
        pageindex: 1,
        delegateName: '',
        delegateStatus:0,
        list: [],
      };
    },
    fetchTypeSuccess(state, { payload }) {
      return {
        ...state,
        typelist: payload.typeList || [],
      };
    },
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        list: payload.List || [],
        totalCount: payload.TotalCount || 0,
        pageindex: payload.pageindex,
        pagecount: payload.pagecount,
      };
    },
    showSignEdit(state, { payload }){
      return {
        ...state,
        isShowSign: payload.isShowSign,
      };
    },
    ondelegateNameChanged(state, { payload }) {
      return {
        ...state,
        delegateName: payload,
      };
    },
    onStatusChanged(state,{payload}){
      return {
        ...state,
        delegateStatus: payload,
      };
    },
    showEdit(state, { payload }) {
      const currData = payload.currData;
      return {
        ...state,
        currData: currData
          ? {
              Id: currData.Id,
              Description: currData.Description,
              Name: currData.Name,
              StartTime: currData.StartTime,
              EndTime: currData.EndTime,
              DelegateCount: currData.DelegateCount,
            }
          : null,
        isShowEdit: payload.isShowEdit,
      };
    },
  },
};
