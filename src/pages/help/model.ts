import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { getUserIfNullLogout, getUser, setUser } from 'utils/localStore';
import { modalSuccess } from 'components/modal';
import router from 'umi/router';
export const namespace = 'business';

export default {
  namespace,
  state: {
    typeData: [],
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/${namespace}`) {
          const user = getUserIfNullLogout();
          if (user) {
            dispatch({
              type: 'fetchAddress',
              payload: user,
            });
          }
        }
      });
    },
  },

  effects: {
    *fetchQuestionType({ payload }, { put, call, select }) {
      const pars: Props = {
        url: '/api/helpcenter/question/type/list',
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchQuestionTypeSuccess',
          payload: {
            typeData: res.data,
          },
        });
      }
    },
  },

  reducers: {
    fetchQuestionTypeSuccess(state, { payload }) {
      return {
        ...state,
        typeData: payload.typeData,
      };
    },
  },
};