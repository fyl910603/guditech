import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { wait } from 'utils/wait';
import { getUser, setUser } from 'utils/localStore';
import { modalSuccess } from 'components/modal';
import successPic from './img/success.png';
import router from 'umi/router';
export const namespace = 'changePhone';

export default {
  namespace,
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
    *save({ payload }, { put, call, select }) {
      const { container } = payload;
      const state = yield select(state => state.changePhone);
      const { phone, verifycode, operationCode } = state;

      const pars: Props = {
        url: '/api/user/modify/phone',
        body: {
          phone,
          verifycode,
          operationCode,
        },
        method: 'PUT',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          title: '手机号码修改成功',
          pic: successPic,
          onOk: () => {
            router.push('/');
          },
        });

        // 更新本地记录
        let user = getUser();
        user.UserName = phone;
        setUser(user);
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
        phone: '',
        verifycode: '',
      };
    },
    // 手机号变化
    onPhoneChanged(state, { payload }) {
      return {
        ...state,
        phone: payload,
      };
    },

    // 验证码变化
    onVerifycodeChanged(state, { payload }) {
      return {
        ...state,
        verifycode: payload,
      };
    },

    // 打开图片验证码
    openPicVerifycodeDone(state, { payload }) {
      return {
        ...state,
        isShowPicVerifycode: true,
        pic: payload.pic,
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
