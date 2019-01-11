import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { pageSize } from 'utils/pageSize';

export const namespace = 'balanceChangeList';

export default {
  namespace,
  state: {
    list: [],
    pageindex: 1,
    pagecount: pageSize,
    timeRange: [],
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
        url: '/api/user/money/change/list',
        body: {
          pageindex: payload.pageindex || state.pageindex,
          pagecount: state.pagecount,
          starttime: state.timeRange[0] ? state.timeRange[0].format('YYYY-MM-DD 00:00:00') : '0',
          endtime: state.timeRange[1] ? state.timeRange[1].format('YYYY-MM-DD 23:59:59') : '0',
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
  },

  reducers: {
    init(state, { payload }) {
      return {
        ...state,
        timeRange: [],
        pageindex: 1,
        list: []
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
    onDateChanged(state, { payload }) {
      return {
        ...state,
        timeRange: payload,
      };
    },
  },
};
