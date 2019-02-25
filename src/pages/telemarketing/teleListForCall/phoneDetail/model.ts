import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { pageSize } from 'utils/pageSize';
import { modalSuccess } from 'components/modal';
import successPic from './img/success.png';
import router from 'umi/router';
// import { toRegionTree } from '../send/model';
import { getUser } from 'utils/localStore';

export const namespace = 'orderList';

export default {
  namespace,
  state: {
    seatList:[],
    list: [],
    phoneList:[],
    smsList:[],
    CallData:{},
    pageindex: 1,
    pagecount: pageSize,
    templateList:[],
    isShowRemark:true,
    isShowCall:false,
    isShowTemplateD:true,
    timeRange: [],
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === '/telemarketing/teleListForCall/phoneDetail') {
          dispatch({
            type: 'init',
          });
          dispatch({
            type: 'fetchPhoneSeat',
            payload:{}
          });
          dispatch({
            type: 'fetchPticeTemp',
            payload:{}
          });
          dispatch({
            type: 'fetch',
            payload:{
              orderid:location.query.orderid,
              pagecount:30
            }
          })
          if (location.query.clear !== '1') {
            dispatch({
              type: 'restore',
            });
          }
        }
      });
    },
  },

  effects: {
    // 查询
    *fetch({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container } = payload;
      const pars: Props = {
        url: '/api/callmarketing/order/call/details',
        body: {
          pagecount: payload.pagecount,
          orderid: payload.orderid,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchSuccess',
          payload: {
            List:res.data,
            
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    *fetchPticeTemp({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container } = payload;
      const pars: Props = {
        url: '/api/template/content/list',
        body: {
          pageindex: payload.pageindex || state.pageindex,
          pagecount: state.pagecount,
          send: true,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchPticeTempSuccess',
          payload:res.data,
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    // 获取电话坐席
    *fetchPhoneSeat({ payload }, { put, call, select }) {
      const { container } = payload;
      const pars: Props = {
        url: '/api/callmarketing/seat/list',
        body: {
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
          yield put({
            type: 'fetchSeatSuccess',
            payload: {
              seatlist:res.data
            },
          });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    *onCancelSend({ payload }, { put, call, select }) {
      const { container } = payload;
      const pars: Props = {
        url: '/api/smssend/cancel/order',
        body: {
          orderId: payload,
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        // yield put({
        //   type: 'fetch',
        //   payload: {},
        // });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    // 获取电话明细
    *fetchPhoneDetail({ payload }, { put, call, select }) {
      const { container } = payload;
      const pars: Props = {
        url: '/api/callmarketing/order/call/record/details',
        body: {
          orderid: payload.orderid,
          familyid:payload.familyid
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchPhoneDetailSuccess',
          payload: {
            phonelist:res.data
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    // 发送短信
    *fetchSend({ payload }, { put, call, select }) {
      const { container } = payload;
      const pars: Props = {
        url: '/api/callmarketing/order/call/record/sms/send',
        body: {
          orderid: payload.orderid,
          familyid:payload.familyid,
          addressid:payload.addressid,
          childid:payload.childid,
          templateid:payload.templateid
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchSendSuccess',
          payload: {
          },
        });
        modalSuccess({
          title: '短信发送成功',
          pic: successPic,
          onOk: () => {
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    // 添加备注
    *fetchRemark({ payload }, { put, call, select }) {
      const { container } = payload;
      const pars: Props = {
        url: '/api/callmarketing/order/call/remark/modify',
        body: {
          OrderId: payload.OrderId,
          FamilyId:payload.FamilyId,
          Remark:payload.Remark
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchRemarkSuccess',
          payload: {
          },
        });
        modalSuccess({
          title: '备注保存成功',
          pic: successPic,
          onOk: () => {
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    *fetchSmsDetail({ payload }, { put, call, select }) {
      const { container } = payload;
      const pars: Props = {
        url: '/api/callmarketing/order/call/record/sms/details',
        body: {
          orderid: payload.orderid,
          familyid:payload.familyid
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchSmsDetailSuccess',
          payload: {
            smslist:res.data
          },
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    *onOpenDetail({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container } = payload;
      const pars: Props = {
        url: '/api/smssend/order/details',
        body: {
          orderId: payload,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);

      const user = getUser();
      if (res.success) {
        yield put({
          type: 'onShowDetail',
          payload: {
            ...res.data,
            search_address: user.Address,
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
        isShowRemark:true,
        isShowCall:false,
        isShowTemplateD:true,
        timeRange: [],
        parent: '',
        pageindex: 1,
        orderid: '',
        mobile:'',
        list: [],
        // phoneList:[]
      };
    },
    restore(state, { payload }) {
      const { storeData } = state;
      if (storeData) {
        return {
          ...state,
          timeRange: storeData.timeRange,
          templateName: storeData.templateName,
          pageindex: storeData.pageindex,
          orderSn: storeData.orderSn,
        };
      } else {
        return {
          ...state,
        };
      }
    },
    ChangeTempModal(state, { payload }) {
      return {
        ...state,
        isShowTemplateD: true,
      };
    },
    fetchSendSuccess(state, { payload }) {
      return {
        ...state,
        isShowTemplateD: false,
      };
    },
    fetchPhoneDetailSuccess(state, { payload }) {
      return {
        ...state,
        phoneList: payload.phonelist,
      };
    },
    fetchPticeTempSuccess(state, { payload }) {
      return {
        ...state,
        templateList: payload.List,
      };
    },
    fetchSeatSuccess(state, { payload }) {
      return {
        ...state,
        seatList: payload.seatlist,
      };
    },
    fetchSmsDetailSuccess(state, { payload }) {
      return {
        ...state,
        smsList: payload.smslist,
      };
    },
    fetchRemarkSuccess(state, { payload }) {
      return {
        ...state,
        isShowRemark:false
      };
    },
    fetchRemarkFalse(state, { payload }) {
      return {
        ...state,
        isShowRemark:true
      };
    },
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        list: payload.List || [],
      };
    },
    onDateChanged(state, { payload }) {
      return {
        ...state,
        timeRange: payload,
      };
    },
    onOpenCall(state, { payload }) {
      return {
        ...state,
        isShowCall: true,
        CallData:payload
      };
    },
    onParentChanged(state, { payload }) {
      return {
        ...state,
        parent: payload,
      };
    },
    onMobileChanged(state, { payload }) {
      return {
        ...state,
        mobile: payload,
      };
    },
    // onOrderIdChanged(state, { payload }) {
    //   return {
    //     ...state,
    //     orderid: payload,
    //   };
    // },

    onShowDetail(state, { payload }) {
      const { SmsOrderBaseInfo, PriceTemlateContentList, ContentTemplateInfo } = payload;
      const list = PriceTemlateContentList;

      const reply_specificAge = list.filter(h => h.ContentType === 'MSG_PRICE_TYPE_REPLY_AGE')[0]; // 具体年龄
      const reply_birthday = list.filter(h => h.ContentType === 'MSG_PRICE_TYPE_REPLY_BIRTHDAY')[0]; // 生日
      const reply_familyEconomic = list.filter(
        h => h.ContentType === 'MSG_PRICE_TYPE_REPLY_FAMILY_LEVEL'
      )[0]; // 家庭经济情况
      const reply_fullName = list.filter(
        h => h.ContentType === 'MSG_PRICE_TYPE_REPLY_FULL_NAME'
      )[0]; // 全名
      const reply_sex = list.filter(h => h.ContentType === 'MSG_PRICE_TYPE_REPLY_SEX')[0]; // 性别
      const reply_area = list.filter(h => h.ContentType === 'MSG_PRICE_TYPE_REPLY_REGION')[0]; //  地区

      const search_age = list.filter(h => h.ContentType === 'MSG_PRICE_TYPE_SEARCH_AGE')[0]; // 年龄
      const search_userOrder = list.filter(
        h => h.ContentType === 'MSG_PRICE_TYPE_SEARCH_PRIORITY'
      )[0]; // 用户优先
      const search_region = list.filter(h => h.ContentType === 'MSG_PRICE_TYPE_SEARCH_REGION')[0]; // 区域
      const search_sex = list.filter(h => h.ContentType === 'MSG_PRICE_TYPE_SEARCH_SEX')[0]; // 性别
      let search_radius = list.filter(h => h.ContentType === 'MSG_PRICE_TYPE_SEARCH_RANGE')[0]; // 半径范围

      const result = { ...state.orderDetail };
      // 年龄
      result.search_age = search_age;
      // 性别
      result.search_sex = search_sex;
      // 区域
      if (search_region) {
        const json = JSON.parse(search_region.ContentValue);

        result.search_region = {
          ...search_region,
          // tree: toRegionTree(json),
        };
      } else {
        result.search_region = null;
      }
      // 半径
      result.search_radius = search_radius;

      // 发送顺序
      result.search_userOrder = search_userOrder;

      // ---------------------反馈信息
      result.reply_specificAge = reply_specificAge;
      result.reply_birthday = reply_birthday;
      result.reply_familyEconomic = reply_familyEconomic;
      result.reply_fullName = reply_fullName;
      result.reply_sex = reply_sex;
      result.reply_area = reply_area;
      result.basePrice = payload.BasePrice;
      result.search_address = payload.search_address;

      result.form = {
        search_age1: search_age ? search_age.ContentValue.split('-')[0] : null,
        search_age2: search_age ? search_age.ContentValue.split('-')[1] : null,
        search_sex: search_sex ? search_sex.ContentValue : null,
        search_area: search_region ? getAreas(JSON.parse(search_region.ContentValue)) : '',
        search_checked_address: search_radius ? search_radius.ContentValue : false,
        // search_radius: search_radius ? search_radius.ContentValue: false,

        search_radius: search_radius ? search_radius.ContentValue.split('-')[1] : false,

        search_userOrder: search_userOrder ? search_userOrder.ContentValue : null,

        MSG_PRICE_TYPE_REPLY_AGE: reply_specificAge && reply_specificAge.ContentValue === '1',
        MSG_PRICE_TYPE_REPLY_BIRTHDAY: reply_birthday && reply_birthday.ContentValue === '1',
        MSG_PRICE_TYPE_REPLY_FAMILY_LEVEL:
          reply_familyEconomic && reply_familyEconomic.ContentValue === '1',
        MSG_PRICE_TYPE_REPLY_FULL_NAME: reply_fullName && reply_fullName.ContentValue === '1',
        MSG_PRICE_TYPE_REPLY_SEX: reply_sex && reply_sex.ContentValue === '1',
        MSG_PRICE_TYPE_REPLY_REGION: reply_area && reply_area.ContentValue === '1',

        count: SmsOrderBaseInfo.SendCount,
        sendtime: SmsOrderBaseInfo.SendTime,

        priceOne: SmsOrderBaseInfo.PriceOne / 100,
        totalPrice: SmsOrderBaseInfo.TotalPrice / 100,
        salePrice: SmsOrderBaseInfo.SalePrice / 100,
        payMoney: SmsOrderBaseInfo.PayMoney / 100,

        templateName: ContentTemplateInfo.TemplateName,
        smsContent: ContentTemplateInfo.SmsContent,
        smsLink: ContentTemplateInfo.SmsLink,
      };

      return {
        ...state,
        isShowDetail: true,
        orderDetail: result,
      };
    },
    onCloseDetail(state, { payload }) {
      return {
        ...state,
        isShowDetail: false,
      };
    },
  },
};

function getAreas(json) {
  const list = [];
  json.map(p => {
    list.push(p.ProvinceCode);
    p.CityList.map(c => {
      list.push(c.CityCode);
      c.CountyList.map(o => {
        list.push(o.CountyCode);
      });
    });
  });

  return list;
}
