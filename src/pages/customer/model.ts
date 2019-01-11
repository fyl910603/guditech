import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { modalSuccess } from 'components/modal';
import { pageSize } from 'utils/pageSize';

export const namespace = 'customer';

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
        if (location.pathname === `/${namespace}`) {
          dispatch({
            type: 'init',
          });
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
        url: '/api/custom/list',
        body: {
          pageindex: payload.pageindex || state.pageindex,
          pagecount: state.pagecount,
          name: state.ChildsName,
          phone: state.Mobile,
          address: state.DetailAddress,
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
      let url = '/api/custom/add';

      if (state.currData) {
        url = '/api/custom/modify';
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
        url: '/api/custom/delete',
        body: {
          Id: payload,
        },
        method: 'DELETE',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          message: '该客户资产删除成功!',
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
        ChildsName: '',
        Mobile: '',
        DetailAddress: '',
        pageindex: 1,
      };
    },
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        list: payload.List || [],
        totalCount: payload.TotlaCount || payload.TotalCount || 0,
        pageindex: payload.pageindex,
        pagecount: payload.pagecount,
      };
    },

    showEdit(state, { payload }) {
      const currData = payload.currData;
      return {
        ...state,
        currData,
        isShowEdit: payload.isShowEdit,
      };
    },

    onNameChanged(state, { payload }) {
      return {
        ...state,
        ChildsName: payload,
      };
    },
    onMobileChanged(state, { payload }) {
      return {
        ...state,
        Mobile: payload,
      };
    },
    onDetailAddressChanged(state, { payload }) {
      return {
        ...state,
        DetailAddress: payload,
      };
    },
  },
};
