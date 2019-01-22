import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { modalSuccess } from 'components/modal';
import { pageSize } from "utils/pageSize";

export const namespace = 'templateList';

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
        if (location.pathname === `/shortMessage/${namespace}`) {
          dispatch({
            type: 'init',
          });
          dispatch({
            type: 'fetchType',
            payload: {
              status: 1
            },
          });
        }
      });
    }
  },

  effects: {
    // 查询
    *fetch({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);

      const { container } = payload;
      const pars: Props = {
        url: '/api/template/content/list',
        body: {
          pageindex: payload.pageindex || state.pageindex,
          pagecount: state.pagecount,
        },
        method: 'GET',
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
      const pars: Props = {
        url: '/api/smssend/sign/list',
        body: {
          status: payload.status,
          channelcode: state.list[0].ChannelCode,
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
          templatename: payload.templatename,
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
      let url = '/api/template/content/add';

      if (state.currData) {
        url = '/api/template/content/modify';
        data.templateid = state.currData.templateid;
      }

      const pars: Props = {
        url,
        body: data,
        method: state.currData ? 'PUT' : 'POST',
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
          message: '短信模板提交审核成功，我们将在1~3个工作日完成审核!',
        });
        
      } else {
        MessageBox.show(res.message, container);
      }
    },

    *onDelete({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container, data } = payload;
      const pars: Props = {
        url: '/api/template/content/delete',
        body: {
          templateid: payload,
        },
        method: 'DELETE',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          message: '该短信模板删除成功!',
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
    showEdit(state, { payload }) {
      const currData = payload.currData;
      return {
        ...state,
        currData: currData
          ? {
              templateid: currData.TemplateSysId,
              templatcontent: currData.SmsContent,
              templatlink: currData.SmsLink,
              templatename: currData.TemplateName,
            }
          : null,
        isShowEdit: payload.isShowEdit,
      };
    },
  },
};
