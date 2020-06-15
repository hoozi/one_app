import request from '../utils/request';
import { stringify } from 'qs';

export async function queryOverLookForYard(params?:any):Promise<any> {
  return request(`/yms/warehouse/list/1?${stringify(params)}`)
}