import fetch from 'dva/fetch';
import { version } from '../../package.json';
import { getUser } from './localStore';
import router from 'umi/router';

export interface Props {
  url: string;
  headers?: { [key: string]: string };
  body?: any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface Res {
  success: boolean;
  message: string;
  data: any;
}

function getCommonHeader() {
  let user = getUser();
  let userToken = user ? user.UserToken : undefined;

  return {
    application: 'web_test',
    deviceNo: 'web',
    userToken, //登入以后服务端返回的userToken，未登入则为空字符串
    channelCode: 'web',
    appVersion: version, //客户端版本号（客户端自行定义）
  };
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export async function ask(props: Props): Promise<Res> {
  let { headers, body, url, method = 'POST' } = props;

  switch (method) {
    case 'PUT':
    case 'POST':
    case 'DELETE':
      body = JSON.stringify(body);
      break;
    case 'GET': {
      let urlPars = '';
      for (let key in body) {
        if (body[key] !== undefined) {
          urlPars += `&${key}=${encodeURI(body[key])}`;
        }
      }

      if (urlPars.length) {
        if (url.indexOf('?') > -1) {
          url += urlPars;
        } else {
          url += '?' + urlPars.substr(1);
        }
      }
      body = undefined;
    }
  }
  let response = await fetch(url, 
    {
    method,
    body,
    headers: {
      'Content-Type': 'application/json',
      ...getCommonHeader(),
      ...headers,
    },
  }
  );

  if (!response.ok) {
    return {
      success: false,
      message: '服务器内部错误',
      data: null,
    };
  }
  const { ErrorCode, ErrorMessage, Data } = await response.json();

  if (ErrorCode === 301) {
    router.push('/login');
  }

  return {
    success: ErrorCode === 0,
    message: ErrorMessage,
    data: Data,
  };
}

export interface PicUploadProps {
  type: number; // 1.用户头像 2.用户营业执照
  onSuccess: (pars: { ImgPath: string; ImgUrl: string }) => void;
  onError: (err: string) => void;
}

export const getPicUploadProps = (pars: PicUploadProps) => {
  return {
    name: 'file',
    action: `/api/image/upload/${pars.type}`,
    headers: {
      ...getCommonHeader(),
    },
    onChange(info) {
      const { file } = info;
      if (!file) {
        return;
      }

      if (file.status === 'done') {
        const { response } = file;
        const { Data, ErrorCode, ErrorMessage } = response;

        if (ErrorCode === 301) {
          router.push('/login');
        } else if(ErrorCode !== 0) {
          pars.onError(ErrorMessage);
        } else {
          pars.onSuccess({
            ImgPath: Data.ImgPath.replace(/\\/g, '/'),
            ImgUrl: Data.ImgUrl.replace(/\\/g, '/'),
          });
        }
      }
    },
  };
};
