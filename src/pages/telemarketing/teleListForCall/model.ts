import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { modalSuccess } from 'components/modal';
import { pageSize } from 'utils/pageSize';
import { getUser } from 'utils/localStore';
export const namespace = 'teleListForCall';
let ctid: string;
let ptid: string;

let isSubmitting: boolean;
export default {
  namespace,
  state: {
    templateList:[],
    typelist:[],
    list: [],
    orderData:{},
    form: {
      search_sex: '不限',
      sendtype: '1',
    },
    search_age: null,
    search_sex: null,
    search_region: null,
    search_userOrder: null,
    priceList:[],
    timeRange: [],
    pageindex: 1,
    pagecount: pageSize,
    isShowConfirm:true,
  },

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === `telemarketing/teleListForCall`) {
          dispatch({
            type: 'init',
          });
          dispatch({
            type: 'fetch',
            payload: {
              pageindex: 1,
              pagecount: pageSize,
              send: true,
            },
          });
          dispatch({
            type: 'fetchPriceList',
            payload:{}
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
    init(state, { payload }) {
      return {
        ...state,
        timeRange: [],
        ordername: '',
        pageindex: 1,
        ordersn: '',
      };
    },
    // 获取模板下拉列表
    *fetchPriceList({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const pars: Props = {
        url: '/api/callmarketing/pricetemplate/pulldown/list',
        body: {},
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchPriceListSuccess',
          payload: {
            ...state,
            typelist: res.data
          }
        });
        yield put({
          type: 'fetchPrice',
          payload: res.data[0]
        });
      }
    },
    // 获取价格模板详细内容
    *fetchPrice({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      ptid = payload.TemlateId;
      const pars: Props = {
        url: '/api/callmarketing/pricetemplate/content/list',
        body: {
          ptid:payload.TemlateId,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'fetchPriceSuccess',
          payload: {
            list:res.data
          }
        });
        // const region = (res.data || []).filter(
        //   item => item.ContentType === 'MSG_PRICE_TYPE_SEARCH_REGION'
        // )[0];
        // if (region) {
        //   yield put({
        //     type: 'getExpect',
        //     payload: {
        //       search_area_dis: region.DefaultValue,
        //     },
        //   });
        // }
      }
    },
    // 查询
    *fetch({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container } = payload;
      const pars: Props = {
        url: '/api/callmarketing/order/list',
        body: {
          pageindex: payload.pageindex || state.pageindex,
          pagecount: state.pagecount,
          starttime: state.timeRange[0] ? state.timeRange[0].format('YYYY-MM-DD 00:00:00') : '0',
          endtime: state.timeRange[1] ? state.timeRange[1].format('YYYY-MM-DD 23:59:59') : '0',
          ordername: state.ordername,
          ordersn: state.ordersn,
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
    // *fetchPriceList({ payload }, { put, call, select }) {
    //   const state = yield select(state => state[namespace]);
    //   const { container} = payload;
    //   const pars: Props = {
    //     url: '/api/template/price/list',
    //     body: {},
    //     method: 'GET',
    //   };
    //   const res: Res = yield call(ask, pars);
    //   if (res.success) {
    //     yield put({
    //       type: 'fetchPriceListSuccess',
    //       payload: {
    //         ...state,
    //         priceList: res.data
    //       }
    //     });
    //   }else {
    //     MessageBox.show(res.message, container);
    //   }
    // },
    *onSave({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container, data } = payload;
      let url = '/api/callmarketing/order/add';

      // if (state.currData) {
      //   url = '/api/template/content/modify';
      //   data.templateid = state.currData.templateid;
      // }

      const pars: Props = {
        url,
        body:{
          OrderName:payload.addOrderName,
          PriceTemplateId:payload.templateId,
          Content:getContent(state, payload.search_area_dis)
        },
        method:'POST',
        // method: state.currData ? 'PUT' : 'POST',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'onHideConfirm',
          payload: {},
        });
        modalSuccess({
          message: '短信模板提交审核成功，我们将在1~3个工作日完成审核!',
        });
        yield put({
          type: 'fetch',
          payload: {},
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    *showOrderD({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container, data } = payload;
      const pars: Props = {
        url: '/api/callmarketing/order/details',
        body: {
          orderid: payload.OrderId,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        yield put({
          type: 'showOrderDSuccess',
          payload: {
            ...state,
            orderData: res.data
          }
        });
      } else {
        MessageBox.show(res.message, container);
      }
    },
    *onDelete({ payload }, { put, call, select }) {
      const state = yield select(state => state[namespace]);
      const { container, data } = payload;
      const pars: Props = {
        url: '/api/callmarketing/order/delete',
        body: {
          orderid: payload,
        },
        method: 'GET',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        modalSuccess({
          message: '该申请删除成功!',
        });
        yield put({
          type: 'fetch',
          payload: {},
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
        
      };
    },
    restore(state, { payload }) {
      const { storeData } = state;
      if (storeData) {
        return {
          ...state,
          pageindex: storeData.pageindex,
        };
      } else {
        return {
          ...state,
        };
      }
    },
    fetchPriceListSuccess(state, { payload }) {
      return {
        ...state,
        templateList: payload.typelist || [],
      };
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
    fetchPriceSuccess(state, { payload }) {
      
      const {list} = payload;
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
          priceOne: payload.price/100,
        },
        isShowConfirm: payload,
      };
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
        ordersn: payload,
      };
    },
    onHideConfirm(state, { payload }) {
      return {
        ...state,
        isShowConfirm: false,
      };
    },
    onOrderSnChanged(state, { payload }) {
      return {
        ...state,
        ordername: payload,
      };
    },
    showEdit(state, { payload }) {
      const currData = payload.currData;
      return {
        ...state,
        currData: currData
          ? {
              templateid: currData.TemplateSysId,
              templatcontent: currData.SmsContent,
              templatlink: currData.SmsLink,
              templatename: currData.TemplateName,
              createTime: currData.CreateTime,
              examinedTime: currData.ExaminedTime,
            }
          : null,
        isShowEdit: payload.isShowEdit,
      };
    },
    showOrderDSuccess(state, { payload }) {
      const orderData = payload.orderData;
      return {
        ...state,
        orderData: payload.orderData
      };
    },
  },
};
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