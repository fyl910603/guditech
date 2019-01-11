import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import router from 'umi/router';
import { getUser } from 'utils/localStore';
export const namespace = 'send';

let ctid: string;
let ptid: string;

let isSubmitting: boolean;

export default {
  namespace,
  state: {
    form: {
      search_sex: '不限',
      sendtype: '1',
    },
    search_age: null,
    search_sex: null,
    search_region: null,
    search_userOrder: null,
    price: 0,
    basePrice: 0,
    isShowConfirm: false,
  },
  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `/shortMessage/templateListForSend/${namespace}`) {
          const query = location.query;
          ctid = query.id;

          isSubmitting = false;

          dispatch({
            type: 'clear',
            payload: {},
          });

          dispatch({
            type: 'fetchPriceList',
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    *fetchPriceList({ payload }, { put, call, select }) {
      const pars: Props = {
        url: '/api/template/price/list',
        body: {},
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchPrice',
          payload: res.data[0],
        });
      }
    },
    *fetchPrice({ payload }, { put, call, select }) {
      ptid = payload.PtId;
      const pars: Props = {
        url: '/api/template/price/content/list',
        body: {
          ptid,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchPriceSuccess',
          payload: {
            BasePrice: payload.BasePrice / 100,
            IsReadonly: payload.IsReadonly,
            MinSendCount: payload.MinSendCount, // 最少发送数量
            list: res.data,
          },
        });

        const region = (res.data || []).filter(
          item => item.ContentType === 'MSG_PRICE_TYPE_SEARCH_REGION'
        )[0];
        if (region) {
          yield put({
            type: 'getExpect',
            payload: {
              search_area_dis: region.DefaultValue,
            },
          });
        }
      }
    },
    *fetchTemplate({ payload }, { put, call, select }) {
      const pars: Props = {
        url: '/api/template/content/details',
        body: {
          templateId: ctid,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchTemplateSuccess',
          payload: res.data,
        });
      }
    },
    *onSave({ payload }, { put, call, select }) {
      if (isSubmitting) {
        return;
      }
      isSubmitting = true;
      const state = yield select(state => state[namespace]);

      const pars: Props = {
        url: '/api/smssend/create/order',
        body: {
          ctid,
          ptid,
          count: state.form.count,
          content: getContent(state, payload.search_area_dis),
          sendtype: state.form.sendtype,
          sendtime: state.form.sendtime ? state.form.sendtime.format('YYYY-MM-DD HH:mm:ss') : '',
        },
        method: 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'onHideConfirm',
          payload: {},
        });
        isSubmitting = false;
        router.push('/shortMessage/templateListForSend/orderList');
      } else {
        isSubmitting = false;
        MessageBox.show(res.message, payload.container);
      }
    },
    *onShowConfirm({ payload }, { put, call, select }) {
      yield put({
        type: 'fetchTemplate',
        payload: {},
      });
      yield put({
        type: 'getPrice',
        payload: {
          search_area_dis: payload.search_area_dis,
        },
      });

      yield put({
        type: 'onShowConfirmDone',
        payload: {
          price: payload.price,
          isShowConfirm: true,
        },
      });
    },
    *getPrice({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const pars: Props = {
        url: '/api/smssend/price',
        body: {
          ptid,
          count: state.form.count,
          content: getContent(state, payload.search_area_dis),
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'getPriceSuccess',
          payload: res.data,
        });
      }
    },
    *getExpect({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      // if(!state.form.count) {
      //   return;
      // }
      const pars: Props = {
        url: '/api/smssend/expect',
        body: {
          ptid,
          count: state.form.count,
          content: getContent(state, payload.search_area_dis),
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'getExpectSuccess',
          payload: res.data,
        });
      }
    },
  },

  reducers: {
    clear(state, { payload }) {
      return {
        ...state,
        form: {
          search_sex: '不限',
          sendtype: '1',
        },
      };
    },
    fetchPriceSuccess(state, { payload }) {
      const { list } = payload;

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

      const result = { ...state };
      result.search_isReadonly = payload.IsReadonly;
      result.minSendCount = payload.MinSendCount;

      const defaultForm: any = {
        sendtype: '1',
      };
      // 年龄
      if (search_age) {
        const values = search_age.ContentValue.split('-');
        const list = [];
        for (let i = Number(values[0]); i <= Number(values[1]); i++) {
          list.push(String(i));
        }
        result.search_age = {
          ...search_age,
          list,
        };

        const defaultValue = search_age.DefaultValue.split('-');
        defaultForm.search_age1 = defaultValue[0];
        defaultForm.search_age2 = defaultValue[1];
      } else {
        result.search_age = null;
      }
      // 性别
      if (search_sex) {
        result.search_sex = {
          ...search_sex,
          list: [
            { value: '0', text: '不限' },
            { value: '1', text: '男' },
            { value: '2', text: '女' },
          ],
        };

        defaultForm.search_sex = search_sex.DefaultValue;
      } else {
        result.search_sex = null;
      }
      // 区域
      if (search_region) {
        const json = JSON.parse(search_region.ContentValue);
        result.search_region = {
          ...search_region,
          tree: toRegionTree(json),
        };
        defaultForm.search_area = (search_region.DefaultValue || '').split(',');
      } else {
        result.search_region = null;
      }

      // 半径
      if (search_radius) {
        const values = search_radius.ContentValue.split('-');
        const list = [];
        for (let i = Number(values[0]); i <= Number(values[1]); i++) {
          list.push(String(i));
        }
        result.search_radius = {
          ...search_radius,
          list,
        };

        const defaultValue = search_radius.DefaultValue.split('-');
        defaultForm.search_radius = defaultValue[1];
        defaultForm.search_checked_address = search_radius.DefaultValue !== '';
      } else {
        result.search_radius = null;
      }

      // 发送顺序
      if (search_userOrder) {
        result.search_userOrder = {
          ...search_userOrder,
        };
        defaultForm.search_userOrder = search_userOrder.DefaultValue;
      } else {
        result.search_userOrder = null;
      }

      // ---------------------反馈信息
      result.reply_specificAge = reply_specificAge;
      result.reply_birthday = reply_birthday;
      result.reply_familyEconomic = reply_familyEconomic;
      result.reply_fullName = reply_fullName;
      result.reply_sex = reply_sex;
      result.reply_area = reply_area;
      result.basePrice = payload.BasePrice;
      result.priceTemplate = list;
      result.form = defaultForm;

      const user = getUser();
      result.search_address = user.Address;

      return result;
    },

    fetchTemplateSuccess(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          templateName: payload.TemplateName,
          smsContent: payload.SmsContent,
          smsLink: payload.SmsLink,
        },
      };
    },

    onSearchAge1Changed(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          search_age1: payload,
        },
      };
    },
    onSearchAge2Changed(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          search_age2: payload,
        },
      };
    },

    onSearchSexChanged(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          search_sex: payload,
        },
      };
    },

    onSearchAreaChanged(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          search_area: payload,
        },
      };
    },

    onSearchCheckedAddressChanged(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          search_checked_address: payload,
        },
      };
    },
    onSearchRadiusChanged(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          search_radius: payload,
        },
      };
    },

    onSearchUserOrderNew(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          search_userOrder: payload ? '1' : '0',
        },
      };
    },
    onSearchUserOrderOld(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          search_userOrder: payload ? '2' : '0',
        },
      };
    },

    onFeedbackChanged(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          [payload.type]: payload.value,
        },
      };
    },

    onCountChanged(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          count: payload,
        },
      };
    },
    onSendTypeChanged(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          sendtype: payload,
        },
      };
    },
    onSendTimeChanged(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          sendtime: payload,
        },
      };
    },

    onShowConfirmDone(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          priceOne: payload.price,
        },
        isShowConfirm: payload,
      };
    },

    onHideConfirm(state, { payload }) {
      return {
        ...state,
        isShowConfirm: false,
      };
    },

    getPriceSuccess(state, { payload }) {
      return {
        ...state,
        form: {
          ...state.form,
          totalPrice: payload.TotalPrice / 100,
          salePrice: (payload.TotalPrice - payload.DiscountPrice) / 100,
          payMoney: payload.DiscountPrice / 100,
        },
      };
    },

    getExpectSuccess(state, { payload }) {
      return {
        ...state,
        expectCount: payload.ExpectCount,
      };
    },
  },
};

export function toRegionTree(json: any[]) {
  const tree = [];
  json.map(province => {
    let p: any = {
      title: province.ProvinceName,
      key: province.ProvinceCode,
    };

    if (province.CityList) {
      p.children = [];
      province.CityList.map(city => {
        const c: any = {
          title: city.CityName,
          key: city.CityCode,
        };
        p.children.push(c);

        if (city.CountyList) {
          c.children = [];
          city.CountyList.map(area => {
            const a = {
              title: area.CountyName,
              key: area.CountyCode,
            };
            c.children.push(a);
          });
        }
      });
    }
    tree.push(p);
  });
  return tree;
}

function getPriceTemplate(priceTemplate, type) {
  const value = priceTemplate.filter(h => h.ContentType === type)[0];
  if (!value) {
    return {};
  }
  return {
    Id: value.Id,
    ContentValue: value.ContentValue,
    ContentType: value.ContentType,
  };
}

function getContent(state, search_area_dis) {
  const { form, priceTemplate, search_age, search_sex, search_region, search_userOrder } = state;
  const list = [
    getContentItem(search_age, {
      ...getPriceTemplate(priceTemplate, 'MSG_PRICE_TYPE_SEARCH_AGE'), // 年龄
      ContentValue: `${form.search_age1}-${form.search_age2}`,
    }),
    getContentItem(search_sex, {
      ...getPriceTemplate(priceTemplate, 'MSG_PRICE_TYPE_SEARCH_SEX'), // 性别
      ContentValue: form.search_sex,
    }),
    getContentItem(search_region, {
      ...getPriceTemplate(priceTemplate, 'MSG_PRICE_TYPE_SEARCH_REGION'), // 区域
      ContentValue: `${search_area_dis}`,
    }),
    getContentItem(form.search_checked_address, {
      ...getPriceTemplate(priceTemplate, 'MSG_PRICE_TYPE_SEARCH_RANGE'), // 半径范围
      ContentValue: `0-${form.search_radius}`,
    }),
    getContentItem(search_userOrder, {
      ...getPriceTemplate(priceTemplate, 'MSG_PRICE_TYPE_SEARCH_PRIORITY'), // 用户优先
      ContentValue: form.search_userOrder || '0',
    }),
    getContentItem(form.MSG_PRICE_TYPE_REPLY_AGE, {
      ...getPriceTemplate(priceTemplate, 'MSG_PRICE_TYPE_REPLY_AGE'), // 具体年龄
      ContentValue: '1',
    }),
    getContentItem(form.MSG_PRICE_TYPE_REPLY_BIRTHDAY, {
      ...getPriceTemplate(priceTemplate, 'MSG_PRICE_TYPE_REPLY_BIRTHDAY'), // 生日
      ContentValue: '1',
    }),
    getContentItem(form.MSG_PRICE_TYPE_REPLY_FAMILY_LEVEL, {
      ...getPriceTemplate(priceTemplate, 'MSG_PRICE_TYPE_REPLY_FAMILY_LEVEL'), // 家庭经济情况
      ContentValue: '1',
    }),
    getContentItem(form.MSG_PRICE_TYPE_REPLY_FULL_NAME, {
      ...getPriceTemplate(priceTemplate, 'MSG_PRICE_TYPE_REPLY_FULL_NAME'), // 全民
      ContentValue: '1',
    }),
    getContentItem(form.MSG_PRICE_TYPE_REPLY_SEX, {
      ...getPriceTemplate(priceTemplate, 'MSG_PRICE_TYPE_REPLY_SEX'), // 性别
      ContentValue: '1',
    }),
    getContentItem(form.MSG_PRICE_TYPE_REPLY_REGION, {
      ...getPriceTemplate(priceTemplate, 'MSG_PRICE_TYPE_REPLY_REGION'), // 地区
      ContentValue: '1',
    }),
  ].filter(h => h !== undefined);

  return JSON.stringify(list);
}

function getContentItem(is: boolean, value) {
  return is ? value : undefined;
}
