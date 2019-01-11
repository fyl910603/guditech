import { getUserIfNullLogout, setUser, getUser } from 'utils/localStore';
import { ask, Res, Props } from 'utils/ask';
import { removeUser } from 'utils/localStore';
import router from 'umi/router';
import { message } from 'antd';
export const namespace = 'index';

export default {
  namespace,
  state: {
    bannerList: [],
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/`) {
          const user = getUserIfNullLogout();
          if (user) {
            dispatch({
              type: 'show',
              payload: user,
            });
          }
          dispatch({
            type: 'reloadUserInfo',
            payload: {},
          });
          dispatch({
            type: 'fetchBanner',
            payload: user,
          });
        }
      });
    },
  },

  effects: {
    // 获取banner 列表数据
    *fetchBanner({ payload }, { put, call, select }) {
      // const state = yield select(state => state[namespace]);
      // const { container } = payload;
      const pars: Props = {
        url: '/api/user/banner?type=1',
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      const defaultData = {
        picUrl: 'https://test.guditech.com/img/banner/1_default.jpg',
      };
      if (res.success) {
        const list = res.data && res.data.length ? res.data : [defaultData];
        yield put({
          type: 'getBannerSuccess',
          payload: list.map(item => ({
            ...item,
            picUrl: (item.picUrl || '').replace(/\\/g, '/'),
          })),
        });
      } else {
        yield put({
          type: 'getBannerSuccess',
          payload: [defaultData],
        });
      }
    },
    // 重新获取登录用户信息
    *reloadUserInfo({ payload }, { put, call, select }) {
      const pars: Props = {
        url: '/api/user/userinfo',
        body: {},
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        let user = getUser();
        setUser({
          ...res.data,
          UserToken: user.UserToken,
          UserName: res.data.Mobile,
        });

        user = getUser();

        yield put({
          type: 'show',
          payload: user,
        });
      }
    },

    *logout({ payload }, { put, call, select }) {
      const pars: Props = {
        url: '/api/user/logout',
        body: {},
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        removeUser();
        yield call(() => router.push('/login'));
      } else {
        message.error(res.message);
      }
    },
  },

  reducers: {
    // 打开时填充数据
    show(state, { payload }) {
      return {
        ...state,
        user: payload,
      };
    },

    getBannerSuccess(state, { payload }) {
      return {
        ...state,
        bannerList: payload,
      };
    },
  },
};
