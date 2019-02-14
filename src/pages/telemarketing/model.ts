import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
export const namespace = 'shortMessage';

export default {
  namespace,
  state: {},

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/${namespace}`) {
        }
      });
    },
  },

  effects: {
    // 获取充值金额
    *fetchRecharge({ payload }, { put, call, select }) {
      const { data, container } = payload;
      const pars: Props = {
        url: '/api/recharge/mainpage',
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({ type: 'fetchRechargeSuccess', payload: res.data });
      } else {
        MessageBox.show(res.message, container);
      }
    },
  },

  reducers: {
    // 打开时填充数据
    show(state, { payload }) {
      return {
        ...state,
        UserName: payload.UserName,
        rechargeid: '',
        paytype: '',
      };
    },
  },
};
