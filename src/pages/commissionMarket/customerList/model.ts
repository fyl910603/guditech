import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { modalSuccess } from 'components/modal';
import { pageSize } from "utils/pageSize";

export const namespace = 'customerList';

export default {
  namespace,
  state: {
    list: [],
    delegateInfo:{},
    pageindex: 1,
    Description:'',
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
              CustomerName:'',
              CustomerMobile:''
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
        url: '/api/callcenter/delegate/customer/list',
        body: {
          DelegateId:location.search.split('=')[1],
          CustomerName:state.CustomerName,
          CustomerMobile:state.CustomerMobile,
          Status:state.Status,
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
    *fetchdelegateDetail({ payload }, { put, call, select }) {
      const {container } = payload;
      const state = yield select(state => state[namespace]);
      const pars: Props = {
        url: '/api/callcenter/delegate/details',
        body: {
          Id: payload.Id,
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({ type: 'fetchDetailSuccess', payload:res.data});
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
          CustomerName: payload.CustomerName,
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
    // 添加备注
    *changeRemark({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container, data } = payload;
      const pars: Props = {
        url: '/api/callcenter/delegate/remark/modify',
        body: {
          'Id': payload.Id,
          'Remark':payload.Remark
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          message: '备注修改成功!',
        });
        yield put({
          type: 'showRemark',
          payload: {
            isShowRemark: false,
          },
        });
        yield put({
          type: 'fetch',
          payload: {},
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
        CustomerName: '',
        Status:0,
        isShowRemark:false,
        list: [],
      };
    },
    fetchDetailSuccess(state, { payload }) {
      return {
        ...state,
        delegateInfo: payload || {},
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
    oncustomerNameChanged(state, { payload }) {
      return {
        ...state,
        CustomerName: payload,
      };
    },
    oncustomerMobileChanged(state, { payload }) {
      return {
        ...state,
        CustomerMobile: payload,
      };
    },
    onStatusChanged(state,{payload}){
      return {
        ...state,
        Status: payload,
      };
    },
    onRemarkChanged(state,{payload}){
      return {
        ...state,
        currData:{
          Remark:payload,
        },
      };
    },
    showRemark(state, { payload }) {
      const currData = payload.currData;
      return {
        ...state,
        currData: currData
          ? {
              Remark: currData.Remark,
            }
          : null,
        isShowRemark: payload.isShowRemark,
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
