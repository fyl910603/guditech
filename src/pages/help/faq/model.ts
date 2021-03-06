import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { getUserIfNullLogout, getUser, setUser } from 'utils/localStore';
import { modalSuccess } from 'components/modal';
import router from 'umi/router';
export const namespace = 'faq';

export default {
  namespace,
  state: {
    questionList: [],
    questionTotal: 0
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/help/${namespace}`) {
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
    *fetchQuestion({ payload }, { put, call, select }) {
      const pars: Props = {
        url: '/api/helpcenter/question/list',
        body: {
          typeid: payload.typeid,
          key: payload.key,
          iscommon: payload.iscommon,
          pageindex: payload.pageindex,
          pagecount: payload.pagecount,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchQuestionSuccess',
          payload: {
            QuestionList: res.data.List,
            QuestionTotal: res.data.TotalCount
          },
        });
      }
    },
    *fetchQuestionDetail({ payload }, { put, call, select }) {
      const pars: Props = {
        url: '/api/helpcenter/question/details',
        body: {
          id: payload.id,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchQuestionDetailSuccess',
          payload: {
            details: res.data,
          },
        });
      }
    },
  },

  reducers: {
    fetchQuestionSuccess(state, { payload }) {
      return {
        ...state,
        questionList: payload.QuestionList || [],
        questionTotal: payload.QuestionTotal
      };
    },
    fetchQuestionDetailSuccess(state, { payload }) {
      return {
        ...state,
        details: payload.details,
      };
    },
  },
};