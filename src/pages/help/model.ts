import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { getUserIfNullLogout, getUser, setUser } from 'utils/localStore';
import { modalSuccess } from 'components/modal';
import router from 'umi/router';
export const namespace = 'help';

export default {
  namespace,
  state: {
    typeData: [],
    details : {},
    questionList: [],
    questionTotal: ''
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
            dispatch({
              type: 'fetchQuestionType',
              payload: {},
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
            QuestionTotal: res.data.totalCount
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