import { Toast } from '@ant-design/react-native';
import { navigate } from '../navigation';
import isObject from 'lodash/isObject';
import { getToken } from './token';
import { service_url } from '../constants';

interface ICodeMessage {
  [code: string]: string;
}

const codeMessage:ICodeMessage = {
  '200': '操作成功',
  '401': '用户没有权限',
  '403': '访问被禁止',
  '404': '资源不存在',
  '426': '用户名或密码错误',
  '428': '未知',
  '500': '服务器发生错误',
  '502': '网关错误',
  '504': '网关超时',
};

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext:string = codeMessage[response.status] || response.statusText;
  
  response.status != 401 && Toast.fail(errortext);
  throw response.status;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url: string, options?: any) {
  
  const token = await getToken();
  const headers = {
    Authorization: token ? `Bearer ${token}` : 'Basic YXBwOmFwcA==',
    TENANT_ID: 1,
    isToken: !!token
  }
  const defaultOptions = {
    credentials: 'include'
  };
  const newOptions = {
    ...defaultOptions, 
    ...options
  };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = isObject(newOptions.body) ? JSON.stringify(newOptions.body) : newOptions.body;
      //console.log(newOptions.body)
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }
  newOptions.headers = {
    ...newOptions.headers,
    ...headers
  }
  return fetch(`${service_url}${url}`, newOptions)
    .then(checkStatus)
    .then(response => {
      const json = response.json();
      return json
    })
    .catch(status => {
      //const { dispatch } = store;
      //if(isNil(e.response)) return Toast.offline('服务器无响应');
      if (status === 401 || status === 403) {
        return navigate('SignOutPlaceholder');
        //return dispatch.user.removeSession();
      }
    });
}