import { ask, Res } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { set, get, remove, setUser } from 'utils/localStore';
import router from 'umi/router';
import { md5 } from 'utils/md5';
const loginUserAndPassword = 'loginUserAndPassword';

export const namespace = 'login';

export default {
  namespace,
  state: {
    isStore: false,
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/${namespace}`) {
          const data = get<any>(loginUserAndPassword);
          dispatch({
            type: 'restore',
            payload: data,
          });
        }
      });
    },
  },

  effects: {
    *login({ payload }, { put, call, select }) {
      let state = yield select(state => state.login);
      const { container } = payload;
      const pars = {
        url: '/api/user/login',
        body: {
          username: state.username,
          password: md5(state.password || ''),
        },
      };

      const res: Res = yield call(ask, pars);
      if (res.success) {
        let { isStore, username } = state;
        if (isStore) {
          set(loginUserAndPassword, {
            username,
            isStore,
          });
        } else {
          remove(loginUserAndPassword);
        }

        setUser({
          ...res.data,
          UserName: username,
        });

        router.push('/');
      } else {
        MessageBox.show(res.message, container);
      }
    },
  },

  reducers: {
    // 用户名变化
    onUsernameChanged(state, { payload }) {
      return {
        ...state,
        username: payload,
      };
    },
    // 密码变化
    onPasswordChanged(state, { payload }) {
      return {
        ...state,
        password: payload,
      };
    },
    // 保存用户密码
    isStoreChanged(state, { payload }) {
      return {
        ...state,
        isStore: payload.isStore,
      };
    },
    restore(state, { payload }) {
      let username = null;
      let isStore = false;

      if (payload) {
        try {
          const data = payload;
          username = data.username;
          isStore = data.isStore;
        } catch {
          username = null;
        }
      }

      return {
        ...state,
        isStore,
        username,
        password: '',
      };
    },
  },
};
