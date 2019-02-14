import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { modalSuccess } from 'components/modal';
import { pageSize } from 'utils/pageSize';

export const namespace = 'visitList';

let orderId: string;

export default {
  namespace,
  state: {
    list: [],
    pageindex: 1,
    pagecount: pageSize,
    contentTypeList: [],
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/shortMessage/templateListForSend/orderList/${namespace}`) {
          const query = location.query;
          orderId = query.orderId;
          dispatch({
            type: 'init',
          });
          dispatch({
            type: 'fetch',
            payload: {},
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
        url: '/api/smssend/order/visit/list',
        body: {
          orderId,
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

    *onShowDetail({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container, jumpId } = payload;
      const pars: Props = {
        url: '/api/smssend/order/visit/details',
        body: {
          jumpId,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'onShowDetailSuccess',
          payload: res.data,
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
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        list: payload.List || [],

        totalCount: payload.TotalCount || 0,
        pageindex: payload.pageindex,
        pagecount: payload.pagecount,
      };
    },

    onShowDetailSuccess(state, { payload }) {
      return {
        ...state,
        isShowDetail: true,
        detailData: payload,
      };
    },

    onCloseDetail(state, { payload }) {
      return {
        ...state,
        isShowDetail: false,
      };
    },
  },
};
