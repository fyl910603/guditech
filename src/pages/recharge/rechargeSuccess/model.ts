import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { getUser, setUser } from 'utils/localStore';
import { User } from 'utils/User';
import { wait } from 'utils/wait';

export const namespace = 'rechargeSuccess';

export default {
  namespace,
  state: {},

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        const query = location.query;
        dispatch({
          type: 'fill',
          payload: {
            OrderSN: query.OrderSN,
            PayAmount: query.PayAmount,
          },
        });
      });
    },
  },

  effects: {},

  reducers: {
    fill(state, { payload }) {
      return {
        ...state,
        OrderSN: payload.OrderSN,
        PayAmount: payload.PayAmount,
      };
    },
  },
};
