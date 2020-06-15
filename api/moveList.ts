import request from '../utils/request';
import { stringify } from 'qs';

export async function queryMoveListForYard(params:any):Promise<any> {
  const _params = {
    ...params,
    overFlag: 'N'
  }
  return request(`/yms/app-move/page?${stringify(_params)}`)
}

export async function updateMoveListForYard(params?:any):Promise<any> {
  return request('/yms/ctn-apply/updateAppMove', {
    method: 'PUT',
    body: params
  })
}

export async function queryMoveListForWharf(params:any):Promise<any> {
  const _params = {
    ...params,
    overFlag: 'N'
  }
  return request(`/yms/app-move/getShipAppMovePage?${stringify(_params)}`)
}

export async function updateMoveListForWharf(params?:any):Promise<any> {
  return request('/yms/shipment-plan/appUpdate', {
    method: 'PUT',
    body: params
  })
}

export async function updateMoveListForNone(params?:any):Promise<any> {
  return request('/yms/ctn-info/appMoveCtn', {
    method: 'POST',
    body: params
  })
}


