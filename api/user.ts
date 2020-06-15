import request from '../utils/request';
import { stringify } from 'qs';

export async function queryToken(params?:any):Promise<any> {
  return request(`/auth/oauth/token?${stringify(params)}`)
}

export async function queryCurrentUser():Promise<any> {
  return request('/admin/user/info');
}