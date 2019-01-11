import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import moment from 'moment';
import { pageSize } from "utils/pageSize";

export const namespace = 'rechargelog';

export default {
  namespace,
  state: {
    list: [],
    paymentTypeList: [],
    timeRange: [],
    paytypecode: '',
    pageindex: 1,
    pagecount: pageSize,
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/recharge/${namespace}`) {
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
        url: '/api/recharge/record',
        body: {
          starttime: state.timeRange[0] ? state.timeRange[0].format('YYYYMMDD') : '0',
          endtime: state.timeRange[1] ? state.timeRange[1].format('YYYYMMDD') : '0',
          paytypecode: state.paytypecode || '',
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

    *fetchPayType({ payload }, { put, call, select }) {
      const { data, container } = payload;
      const pars: Props = {
        url: '/api/recharge/mainpage',
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({ type: 'fetchPayTypeSuccess', payload: res.data });
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
        paytypecode: '',
        timeRange: [null, null],
      };
    },
    fetchPayTypeSuccess(state, { payload }) {
      return {
        ...state,
        paymentTypeList: payload.PaymentTypeList,
        rechargeList: payload.RechargeList,
      };
    },
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        list: payload.RecordList || [],
        totalCount: payload.TotalCount || 0,
        paytypecode: payload.PayTypeCode || '',
        pageindex: payload.pageindex,
        pagecount: payload.pagecount,
        timeRange: [
          payload.StartTime ? moment(payload.StartTime) : null,
          payload.EndTime ? moment(payload.EndTime) : null,
        ],
      };
    },

    onPayTypeChanged(state, { payload }) {
      return {
        ...state,
        paytypecode: payload,
      };
    },

    onDateChanged(state, { payload }) {
      return {
        ...state,
        timeRange: payload,
      };
    },
  },
};
