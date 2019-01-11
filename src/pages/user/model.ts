import { ask, Res, Props } from 'utils/ask';
import { MessageBox } from 'components/messageBox';
import { getUser, setUser } from 'utils/localStore';
import router from 'umi/router';
import { modalSuccess } from 'components/modal';
import successPic from './img/success.png';
export const namespace = 'user';

export default {
  namespace: 'user',
  state: [],

  subscriptions: {
    setup({ dispatch, history }, done) {
      history.listen(location => {
        if (location.pathname === '/user') {
          const user = getUser();
          if (user) {
            dispatch({
              type: 'show',
              payload: user,
            });
          }
        }
      });
    },
  },

  effects: {
    *save({ payload }, { put, call, select }) {
      const { data, container } = payload;

      const pars: Props = {
        url: '/api/user/modify/baseinfo2',
        body: {
          ...data,
        },
        method: 'PUT',
      };
      const res: Res = yield call(ask, pars);
      if (res.success) {
        // 更新本地记录
        let user = getUser();
        user.NickName = data.nickname;
        user.AccountHeadImg = data.imgUrl;
        setUser(user);


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
    // 打开时填充数据
    show(state, { payload }) {
      return {
        ...state,
        nickname: payload.NickName,
        imgUrl: payload.AccountHeadImg,
      };
    },

    // 昵称变化时
    nickNameChanged(state, { payload }) {
      return {
        ...state,
        nickname: payload,
      };
    },

    // 照片上传
    picUpload(state, { payload }) {
      return {
        ...state,
        imgpath: payload.ImgPath,
        imgUrl: payload.ImgUrl,
      };
    },
  },
};
