import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { modalSuccess } from 'components/modal';
import { pageSize } from 'utils/pageSize';

export const namespace = 'sendList';

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
        url: '/api/smssend/order/send/details',
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

    *onCheck({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container, id } = payload;
      const pars: Props = {
        url: '/api/smssend/order/record/details/check',
        body: {
          id,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetch',
          payload: {},
        });
        // yield put({
        //   type: 'checkSuccess',
        //   payload: res.data,
        // });
        MessageBox.show('成功读取验证信息', container);
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
        list: payload.DetailsList || [],
        contentTypeList: payload.ContentTypeList || [],
        totalSendCount: payload.TotalSendCount,
        currSendCount: payload.CurrSendCount,
        checkedCount: payload.CheckedCount,
        remainCheckCount: payload.RemainCheckCount,

        totalCount: payload.TotalCount || 0,
        pageindex: payload.pageindex,
        pagecount: payload.pagecount,
      };
    },

    // checkSuccess(state, { payload }) {
    //   return {
    //     ...state,
    //     isShowCheck: true,
    //     checkData: payload,
    //   };
    // },

    onCloseCheck(state, { payload }) {
      return {
        ...state,
        isShowCheck: false,
      };
    },
  },
};
