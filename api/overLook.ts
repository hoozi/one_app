import request from '../utils/request';
import { stringify } from 'qs';

export async function queryOverLookForYard(params?:any):Promise<any> {
  return request(`/yms/location/list?${stringify(params)}`)
}

export async function queryArea():Promise<any> {
  return request(`/yms/warehouse/getAppLocation/1`)
}

export async function queryCtnInfo(ctnNo:string):Promise<any> {
  return request(`/yms/ctn-info/appGetInfo?ctnNo=${ctnNo}`)
}