import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import router from 'umi/router';
import { modalSuccess } from 'components/modal';
import successPic from './img/success.png';

export const namespace = 'sinks';

export default {
  namespace,
  state: {
    lastData: [],
    currData: {},
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/${namespace}`) {
          dispatch({
            type: 'fetch',
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    // 获取用户短信发送渠道信息
    *fetch({ payload }, { put, call, select }) {
      const { data, container } = payload;
      const pars: Props = {
        url: '/api/user/smsidentity',
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({ type: 'fetchSuccess', payload: res.data || [] });
      } else {
        MessageBox.show(res.message, container);
      }
    },

    *save({ payload }, { put, call, select }) {
      const { data, container } = payload;

      const state = yield select(state => state[namespace]);
      const { currData } = state;
      const url =
        currData.Id !== undefined ? '/api/user/smsidentity/modify2' : '/api/user/smsidentity/open2';

      const pars: Props = {
        url,
        body: {
          id: currData.Id,
          signname: currData.SignName,
          imgpath: currData.imgpath,
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          title: '信息保存成功',
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
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        lastData: payload[payload.length - 2],
        currData: payload[payload.length - 1] || {},
      };
    },

    signnameChanged(state, { payload }) {
      return {
        ...state,
        currData: {
          ...state.currData,
          SignName: payload,
        },
      };
    },
    // 照片上传
    picUpload(state, { payload }) {
      return {
        ...state,
        currData: {
          ...state.currData,
          imgpath: payload.ImgPath,
          LicenceUrl: payload.ImgUrl,
        },
      };
    },

    showLastInfo(state, { payload }) {
      return {
        ...state,
        isShowLastInfo: payload,
      };
    },
  },
};
