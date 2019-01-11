import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { modalSuccess } from 'components/modal';
import { pageSize } from 'utils/pageSize';

export const namespace = 'templateListForSend';

export default {
  namespace,
  state: {
    list: [],
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

          if (location.query.clear !== '1') {
            dispatch({
              type: 'restore',
            });
          }
        }
      });
    },
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
          send: true,
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
          type: 'showEdit',
          payload: {
            isShowEdit: false,
          },
        });
        modalSuccess({
          message: '短信模板提交审核成功，我们将在1~3个工作日完成审核!',
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
    restore(state, { payload }) {
      const { storeData } = state;
      if (storeData) {
        return {
          ...state,
          pageindex: storeData.pageindex,
        };
      } else {
        return {
          ...state,
        };
      }
    },
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        list: payload.List || [],
        totalCount: payload.TotalCount || 0,
        pageindex: payload.pageindex,
        pagecount: payload.pagecount,

        // 存下条件与页码，从子页回来时恢复
        storeData: {
          pageindex: payload.pageindex,
        },
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
              createTime: currData.CreateTime,
              examinedTime: currData.ExaminedTime,
            }
          : null,
        isShowEdit: payload.isShowEdit,
      };
    },
  },
};
