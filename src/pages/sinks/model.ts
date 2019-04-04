import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import router from 'umi/router';
import { modalSuccess } from 'components/modal';
import successPic from './img/success.png';
import { number } from 'prop-types';

export const namespace = 'sinks';

export default {
  namespace,
  state: {
    lastData: [],
    currData: {},
    signList: [],
  },

  subscriptions: {
    // setup({ dispatch, history }, done) {
    //   history.listen(location => {
    //     if (location.pathname === `/${namespace}`) {
    //       dispatch({
    //         type: 'fetch',
    //         payload: {},
    //       });
    //     }
    //   });
    // },
  },

  effects: {
    // 获取签名列表
    *fetchSign({ payload }, { put, call, select }) {
      const pars: Props = {
        url: '/api/smssend/sign/list',
        body: {
          status: payload.status,
          channelcode: payload.channelcode,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchSignSuccess',
          payload: {
            list: res.data,
          },
        });
      }
    },
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
      const pars: Props = {
        url : '/api/smssend/sign/modify',
        body: {
          SignId:payload.SignId ,
          SignName: payload.editSignName,
          LicenceUrl: payload.editImgUrl,
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'showEdit',
          payload: {
            isShowEdit: false,
          },
        });
        yield put({
          type: 'fetchSign',
          payload: {
            status: payload.status,
            channelcode: payload.channelcode,
          },
        });
        modalSuccess({
          title: '信息保存成功',
          pic: successPic,
          onOk: () => {
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    *add({ payload }, { put, call, select }) {
      const { data, container } = payload;
      const pars: Props = {
        url : '/api/smssend/sign/add',
        body: {
          Channelcode: '',
          SignName: payload.addSignName,
          LicenceUrl: payload.addImgUrl,
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchSign',
          payload: {
            status: payload.status,
            channelcode: payload.channelcode,
          },
        });
        yield put({
          type: 'showAdd',
          payload: {
            isShowAdd: false,
          },
        });
        modalSuccess({
          title: '信息创建成功',
          pic: successPic,
          onOk: () => {
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    *onDelete({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container, data } = payload;
      const pars: Props = {
        url: '/api/smssend/sign/delete',
        body: {
          Id: payload,
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          message: '您已删除短信业务!',
        });
        yield put({
          type: 'fetchSign',
          payload: {
            status: payload.status,
            channelcode: payload.channelcode,
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
  },

  reducers: {
    init(state, { payload }) {
      return {
        ...state,
        pageindex: 1,
        list: [],
        isShowAdd:false,
        isShowEdit:false,
        // isShowCreate:false
      };
    },
    showEdit(state, { payload }) {
      const currData = payload.currData;
      return {
        ...state,
        isShowEdit: payload.isShowEdit,
      };
    },
    showAdd(state, { payload }) {
      return {
        ...state,
        isShowAdd: payload.isShowAdd,
      };
    },
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        lastData: payload[payload.length - 2],
        currData: payload[payload.length - 1] || {},
      };
    },
    
    fetchSignSuccess(state, { payload }) {
      return {
        ...state,
        signList:payload.list,
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
