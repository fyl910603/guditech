import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { getUser, setUser } from 'utils/localStore';
import { User } from 'utils/User';
import { wait } from 'utils/wait';

export const namespace = 'rechargeFail';

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
            StatusRemark: query.StatusRemark,
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
        StatusRemark: payload.StatusRemark,
      };
    },
  },
};
