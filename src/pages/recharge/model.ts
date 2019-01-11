import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { getUser } from 'utils/localStore';
import { User } from 'utils/User';
import router from 'umi/router';
export const namespace = 'recharge';

export default {
  namespace,
  state: {
    paytypeList: [],
    rechargeList: [],
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/${namespace}`) {
          const user = getUser();
          if (user) {
            dispatch({
              type: 'show',
              payload: user,
            });

            dispatch({
              type: 'fetchRecharge',
              payload: {},
            });

            dispatch({
              type: 'clear',
              payload: {},
            });
          }
        }
      });
    },
  },

  effects: {
    // 获取充值金额
    *fetchRecharge({ payload }, { put, call, select }) {
      const { data, container } = payload;
      const pars: Props = {
        url: '/api/recharge/mainpage',
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({ type: 'fetchRechargeSuccess', payload: res.data });
      } else {
        MessageBox.show(res.message, container);
      }
    },

    *save({ payload }, { put, call, select }) {
      const { container } = payload;
      const user: User = getUser();
      const state = yield select(state => state[namespace]);
      const pars: Props = {
        url: '/api/recharge/startpay',
        body: {
          username: state.UserName || user.UserName,
          rechargeid: state.rechargeid,
          paytype: state.paytype,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({ type: 'onTotalAmount', payload: res.data });
        switch (state.paytype) {
          case 'Alipay':
            router.push('/recharge/alipay');
            break;
          case 'WeChat':
            router.push('/recharge/weChat');
            break;
        }
      } else {
        MessageBox.show(res.message, container);
      }
    },
  },

  reducers: {
    // 打开时填充数据
    show(state, { payload }) {
      return {
        ...state,
        UserName: payload.UserName,
        rechargeid: '',
        paytype: '',
      };
    },
    fetchRechargeSuccess(state, { payload }) {
      return {
        ...state,
        paymentTypeList: payload.PaymentTypeList,
        rechargeList: payload.RechargeList,
      };
    },

    onNameChanged(state, { payload }) {
      return {
        ...state,
        UserName: payload,
      };
    },

    onSelectRItem(state, { payload }) {
      return {
        ...state,
        rechargeid: payload,
      };
    },
    onSelectPaytype(state, { payload }) {
      return {
        ...state,
        paytype: payload,
      };
    },

    onTotalAmount(state, { payload }) {
      return {
        ...state,
        totalAmount: payload.TotalAmount,
        QRCode: payload.result,
        OrderSn: payload.OrderSn,
        StatusRemark: payload.StatusRemark,
      };
    },
  },
};
