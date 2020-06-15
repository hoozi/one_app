import { Dispatch } from 'redux';
import { queryOverLookForYard } from '../../api/overLook';
import { REQUEST_OVERLOOK_FOR_YARD,  RECEIVED_OVERLOOK_FOR_YARD } from './actionType';

export const fetchOverLookForYard = (callback?:Function):any => async (dispatch:Dispatch) => {
  dispatch(requestOverLookForYard());
  const response = await queryOverLookForYard();
  if(!response || response.code!==0) {

    return dispatch(receivedOverLookForYard(null));
  };
  callback && callback(response.data);
  
  dispatch(receivedOverLookForYard(response.data));
}

export const requestOverLookForYard = () => ({
  type: REQUEST_OVERLOOK_FOR_YARD
});

export const receivedOverLookForYard = (payload:any) => ({
  type: RECEIVED_OVERLOOK_FOR_YARD,
  payload
})