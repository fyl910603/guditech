import { ask, Res, Props } from 'utils/ask';
import { wait } from 'utils/wait';
import router from 'umi/router';

export const namespace = 'weChat';

let keepAsk = true;
const frequencyAsk = 3; // 秒

export default {
  namespace,
  state: {},

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/recharge/weChat`) {
          keepAsk = true;
          dispatch({
            type: 'beginFetchStatus',
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    // 获取充值状态
    *fetchStatus({ payload }, { put, call, select }) {
      const { data, container } = payload;
      const state = yield select(state => state.recharge);
      const pars: Props = {
        url: '/api/recharge/pay/success',
        body: {
          ordersn: state.OrderSn,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        const data = res.data;
        switch (data.Status) {
          case 0: // 等待支付
            break;
          case 1: // 支付成功
            keepAsk = false;
            router.push(`/recharge/rechargeSuccess?OrderSN=${data.OrderSN}&PayAmount=${data.PayAmount}`);
            break;
          case 2: // 支付失败
            keepAsk = false;
            router.push(`/recharge/rechargeFail?StatusRemark=${data.StatusRemark}`);
        }
      }
    },

    // 轮询
    *beginFetchStatus({ payload }, { put, call }) {
      while (keepAsk) {
        yield wait(frequencyAsk);
        yield put({ type: 'fetchStatus', payload: {} });
      }
    },
  },

  reducers: {
    onClose(state, { payload }) {
      keepAsk = false;
      return {
        ...state,
      };
    },
  },
};
