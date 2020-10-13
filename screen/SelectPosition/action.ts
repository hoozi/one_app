import { Toast,Portal } from '@ant-design/react-native';
import { Dispatch } from 'redux';
import { queryOverLookForYard, queryArea, queryCtnInfo } from '../../api/overLook';
import { REQUEST_OVERLOOK_FOR_YARD,  RECEIVED_OVERLOOK_FOR_YARD, RECEIVED_AREA, RECEIVED_CTN,RESET_FIND_CTN } from './actionType';

export const fetchOverLookForYard = (payload:any, callback?:Function):any => async (dispatch:Dispatch) => {
  dispatch(requestOverLookForYard());
  const response = await queryOverLookForYard(payload);
  if(!response || response.code!==0) {
    return dispatch(receivedOverLookForYard(null));
  };
  callback && callback();
  dispatch(receivedOverLookForYard(response.data.map((item: any) => ({...item,columnName: payload.columnName}))));
}

export const fetchArea = (callback?:Function):any => async (dispatch:Dispatch) => {
  const response = await queryArea();
  if(!response || response.code!==0) {
    return;
  };
  callback && callback();
  dispatch(receivedArea(response.data));
}

export const fetchCtnInfo = (ctnNo:string):any => async (dispatch:Dispatch) => {
  const key = Toast.loading('查询中...', 0)
  const response = await queryCtnInfo(ctnNo);
  if(!response || response.code!==0) {
    return Portal.remove(key);
  };
  Portal.remove(key);
  dispatch(receivedCtn(response.data));
}

export const resetFindCtn = () => ({
  type: RESET_FIND_CTN
})

export const requestOverLookForYard = () => ({
  type: REQUEST_OVERLOOK_FOR_YARD
});

export const receivedOverLookForYard = (payload:any) => ({
  type: RECEIVED_OVERLOOK_FOR_YARD,
  payload
});

export const receivedArea = (payload:any) => ({
  type: RECEIVED_AREA,
  payload
});

export const receivedCtn = (payload:any) => ({
  type: RECEIVED_CTN,
  payload
})