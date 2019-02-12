import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import router from 'umi/router';
import { modalSuccess } from 'components/modal';
import successPic from './img/success.png';
import { pageSize } from 'utils/pageSize';
import { number } from 'prop-types';

export const namespace = 'phone';

export default {
  namespace,
  state: {
    pageindex: 1,
    pagecount: pageSize,
    lastData: [],
    currData: {},
    phoneData: {},
    isShowEdit:true,
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/${namespace}`) {
          dispatch({
            type: 'fetchList',
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    // 获取签名列表
    *fetchList({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { data, container } = payload;
      const pars: Props = {
        url: '/api/callmarketing/apply/list',
        body: {
          pageindex: payload.pageindex || state.pageindex,
          pagecount: state.pagecount,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchListSuccess',
          payload: res.data || {}
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
            isShow: false,
          },
        });
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
    *add({ payload }, { put, call, select }) {
      const { data, container } = payload;
      const pars: Props = {
        url : '/api/callmarketing/apply/add',
        body: {
          TelephoneCount: payload.PhoneCount,
          MobileCount: payload.MobileCount,
          SeatCount: payload.SeatCount,
          Licencel: payload.LicenceUrl
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'showAdd',
          payload: {
            isShow: false,
          },
        });
        modalSuccess({
          title: '信息创建成功',
          pic: successPic,
          onOk: () => {
            router.push('/');
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
        url: '/api/callmarketing/apply/delete',
        body: {
          Id: payload,
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          message: '您已删除此电话业务!',
        });
        yield put({
          type: 'fetchList',
          payload: {
            pageindex: payload.pageindex || state.pageindex,
            pagecount: state.pagecount,
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
  },

  reducers: {
    showEdit(state, { payload }) {
      const currData = payload.currData;
      return {
        ...state,
        isShowEdit: payload.isShow,
      };
    },
    showAdd(state, { payload }) {
      return {
        ...state,
        isShowEdit: payload.isShow,
      };
    },
    // fetchListSuccess(state, { payload }) {
    //   return {
    //     ...state,
    //     lastData: payload[payload.length - 2],
    //     currData: payload[payload.length - 1] || {},
    //   };
    // },
    
    fetchListSuccess(state, { payload }) {
      return {
        ...state,
        phoneData:payload,
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