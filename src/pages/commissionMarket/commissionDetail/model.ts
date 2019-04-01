import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { modalSuccess } from 'components/modal';
import { pageSize } from "utils/pageSize";

export const namespace = 'commissionDetail';

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
        if (location.pathname === `/commissionMarket/${namespace}`) {
          dispatch({
            type: 'fetchdelegateDetail',
            payload: {
              Id:location.search.split('=')[1]
            },
          });
        }
      });
    }
  },

  effects: {
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
  },

  reducers: {
    init(state, { payload }) {
      return {
        ...state,
      };
    },
    fetchDetailSuccess(state, { payload }) {
      return {
        ...state,
        delegateInfo: payload || {},
      };
    },
  },
};
