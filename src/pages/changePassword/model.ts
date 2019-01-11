import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { md5 } from 'utils/md5';
import { modalSuccess } from 'components/modal';
import successPic from './img/success.png';
import router from 'umi/router';
export const namespace = 'changePassword';

export default {
  namespace: 'changePassword',
  state: {},
  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/${namespace}`) {
          dispatch({
            type: 'clear',
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    *change({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container } = payload;

      const pars: Props = {
        url: '/api/user/modify/password',
        body: {
          oldpassword: md5(state.oldpassword),
          newpassword: md5(state.newpassword),
        },
        method: 'PUT',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          title: '密码修改成功',
          pic: successPic,
          onOk: () => {
            router.push('/');
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
  },

  reducers: {
    clear(state, { payload }) {
      return {
        ...state,
        oldpassword: '',
        newpassword: '',
        newpassword2: '',
      };
    },
    // 旧密码变化
    onOldPasswordChanged(state, { payload }) {
      return {
        ...state,
        oldpassword: payload,
      };
    },
    // 新密码变化
    onNewPasswordChanged(state, { payload }) {
      return {
        ...state,
        newpassword: payload,
      };
    },
    // 新密码确认变化
    onNewPassword2Changed(state, { payload }) {
      return {
        ...state,
        newpassword2: payload,
      };
    },
  },
};
