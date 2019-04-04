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

    *editApply({ payload }, { put, call, select }) {
      const { data, container } = payload;
      const pars: Props = {
        url : '/api/callmarketing/apply/modify',
        body: {
          Id:payload.Id,
          TelephoneCount: payload.TelephoneCount,
          MobileCount: payload.MobileCount,
          SeatCount: payload.SeatCount,
          LicenceUrl: payload.Licencel
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
        modalSuccess({
          title: '信息保存成功',
          pic: successPic,
          onOk: () => {
            // router.push('/');
          },
        });
        yield put({
          type: 'fetchList',
          payload: {},
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    *addApply({ payload }, { put, call, select }) {
      const { data, container } = payload;
      const pars: Props = {
        url : '/api/callmarketing/apply/add',
        body: {
          TelephoneCount: payload.TelephoneCount,
          MobileCount: payload.MobileCount,
          SeatCount: payload.SeatCount,
          LicenceUrl: payload.Licencel
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'showAdd',
          payload: {
            isShowAdd: false,
          },
        });
        yield put({
          type: 'fetchList',
          payload: {
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
    MobileCountChanged(state,{payload}){
      return {
        ...state,
        MobileCount: payload,
      };
    },
    PhoneCountChanged(state,{payload}){
      return {
        ...state,
        PhoneCount: payload,
      };
    },
    SeatCountChanged(state,{payload}){
      return {
        ...state,
        SeatCount: payload,
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