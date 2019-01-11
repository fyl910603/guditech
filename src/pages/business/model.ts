import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { getUserIfNullLogout, getUser, setUser } from 'utils/localStore';
import { modalSuccess } from 'components/modal';
import successPic from './img/success.png';
import router from 'umi/router';
export const namespace = 'business';

export default {
  namespace,
  state: {
    addressInfo: {},
    addressList: [],
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
          }
        }
      });
    },
  },

  effects: {
    *fetchAddress({ payload }, { put, call, select }) {
      const pars: Props = {
        url: '/api/user/address',
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchAddressSuccess',
          payload: {
            addressInfo: res.data,
            user: payload,
          },
        });
      }
    },
    *save({ payload }, { put, call, select }) {
      const { container } = payload;
      const state = yield select(state => state[namespace]);
      const pars: Props = {
        url: '/api/user/modify/baseinfo2',
        body: state,
        method: 'PUT',
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

    *onSearchAddress({ payload }, { put, call, select }) {
      const pars: Props = {
        url: '/api/user/place',
        method: 'GET',
        body: {
          placekey: payload,
        },
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'onSearchAddressSuccess',
          payload: {
            list: res.data,
          },
        });
      }
    },
  },

  reducers: {
    onSearchAddressSuccess(state, { payload }) {
      return {
        ...state,
        addressList: payload.list,
      };
    },

    fetchAddressSuccess(state, { payload }) {
      const { user, addressInfo } = payload;
      return {
        ...state,
        nickname: user.NickName,
        imgUrl: user.AccountHeadImg,
        summary: user.Summary,
        addressInfo: {
          address: addressInfo.Address,
          province: addressInfo.Province,
          city: addressInfo.City,
          area: addressInfo.Area,
          longitude: addressInfo.Longitude,
          latitude: addressInfo.Latitude,
          addressDetails: addressInfo.AddressDetails,
          houseNumber: addressInfo.HouseNumber,
        },
      };
    },

    onNickNameChanged(state, { payload }) {
      return {
        ...state,
        nickname: payload,
      };
    },
    onHouseNumberChanged(state, { payload }) {
      return {
        ...state,
        addressInfo: {
          ...state.addressInfo,
          houseNumber: payload,
        },
      };
    },
    onSummaryChanged(state, { payload }) {
      return {
        ...state,
        summary: payload,
      };
    },
    // 照片上传
    onPicUpload(state, { payload }) {
      return {
        ...state,
        imgpath: payload.ImgPath,
        imgUrl: payload.ImgUrl,
      };
    },

    onOpenMap(state, { payload }) {
      return {
        ...state,
        isMapOpen: payload,
      };
    },
    onMapSelected(state, { payload }) {
      return {
        ...state,
        isMapOpen: false,
        addressInfo: payload,
      };
    },

    onAddressChanged(state, { payload }) {
      return {
        ...state,
        addressInfo: {
          ...state.addressInfo,
          ...payload,
        },
      };
    },
  },
};
