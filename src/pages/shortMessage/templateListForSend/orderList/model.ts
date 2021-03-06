import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { pageSize } from 'utils/pageSize';
import { toRegionTree } from '../send/model';
import { getUser } from 'utils/localStore';

export const namespace = 'orderList';

export default {
  namespace,
  state: {
    list: [],
    pageindex: 1,
    pagecount: pageSize,
    timeRange: [],
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/shortMessage/templateListForSend/${namespace}`) {
          dispatch({
            type: 'init',
          });

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
        url: '/api/smssend/order/record/list',
        body: {
          pageindex: payload.pageindex || state.pageindex,
          pagecount: state.pagecount,
          starttime: state.timeRange[0] ? state.timeRange[0].format('YYYY-MM-DD 00:00:00') : '0',
          endtime: state.timeRange[1] ? state.timeRange[1].format('YYYY-MM-DD 23:59:59') : '0',
          ctname: state.templateName,
          orderSn: state.orderSn,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchSuccess',
          payload: {
            ...res.data,
            pageindex: payload.pageindex || state.pageindex,
            pagecount: state.pagecount,
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
        yield put({
          type: 'fetch',
          payload: {},
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
        timeRange: [],
        templateName: '',
        pageindex: 1,
        orderSn: '',
        list: [],
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
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        list: payload.List || [],
        totalCount: payload.TotalCount || 0,
        pageindex: payload.pageindex,
        pagecount: payload.pagecount,

        // 存下条件与页码，从子页回来时恢复
        storeData: {
          pageindex: payload.pageindex,
          timeRange: state.timeRange,
          templateName: state.templateName,
          orderSn: state.orderSn,
        },
      };
    },
    onDateChanged(state, { payload }) {
      return {
        ...state,
        timeRange: payload,
      };
    },
    onTemplateNameChanged(state, { payload }) {
      return {
        ...state,
        templateName: payload,
      };
    },
    onOrderSnChanged(state, { payload }) {
      return {
        ...state,
        orderSn: payload,
      };
    },

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
          tree: toRegionTree(json),
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
