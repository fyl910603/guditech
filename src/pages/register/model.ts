import { ask, Res } from 'utils/ask';
import { wait } from 'utils/wait';
import { MessageBox } from 'components/messageBox';
import { md5 } from 'utils/md5';
import { modalSuccess } from 'components/modal';
import successPic from './img/success.png';
import router from 'umi/router';
export const namespace = 'register';

export default {
  namespace,
  state: {
    waitSeconds: 0,
  },

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
    // 注册
    *register({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container } = payload;
      const pars = {
        url: '/api/user/register',
        body: {
          username: state.username,
          password: md5(state.password || ''),
          verifycode: state.verifycode,
          operationCode: state.operationCode,
        },
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          title: '注册成功',
          pic: successPic,
          onOk: () => {
            router.push('/login');
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },

    // 发送验证码后，等待60秒才能再发
    *beginWait({ payload }, { put, call }) {
      let waitSeconds = 60;

      while (waitSeconds--) {
        yield wait(1);
        yield put({ type: 'setWaitSeconds', payload: { waitSeconds } });
      }
    },

    *openPicVerifycode({ payload }, { put, call }) {
      const pars = {
        url: '/api/user/picverifycode',
        body: {
          phone: payload.phone,
          codetype: payload.codetype,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'openPicVerifycodeDone',
          payload: {
            pic: res.data,
          },
        });
      } else {
        MessageBox.show(res.message, payload.container);
      }
    },
  },

  reducers: {
    clear(state, { payload }) {
      return {
        ...state,
        username: '',
        password: '',
        password2: '',
        verifycode: '',
        operationCode: '',
      };
    },
    // 用户名变化
    onUsernameChanged(state, { payload }) {
      return {
        ...state,
        username: payload,
      };
    },
    // 验证码变化
    onVerifycodeChanged(state, { payload }) {
      return {
        ...state,
        verifycode: payload,
      };
    },
    // 密码变化
    onPasswordChanged(state, { payload }) {
      return {
        ...state,
        password: payload,
      };
    },
    // 确认密码变化
    onPassword2Changed(state, { payload }) {
      return {
        ...state,
        password2: payload,
      };
    },
    // 打开图片验证码
    openPicVerifycodeDone(state, { payload }) {
      return {
        ...state,
        isShowPicVerifycode: true,
        pic: payload.pic
      };
    },
    // 关闭图片验证码
    closePicverifycode(state, { payload }) {
      return {
        ...state,
        isShowPicVerifycode: false,
      };
    },
    // 获取短信验证码成功
    getVerifycodeSuccess(state, { payload }) {
      return {
        ...state,
        operationCode: payload.code,
        isShowPicVerifycode: false,
      };
    },
    // 等待几秒
    setWaitSeconds(state, { payload }) {
      return {
        ...state,
        waitSeconds: payload.waitSeconds,
      };
    },
  },
};
