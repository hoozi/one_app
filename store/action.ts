import { Dispatch } from 'redux';
import { queryCurrentUser } from '../api/user';
import { REQUEST_USER, RECEIVED_USER } from './actionType';

export const fetchCurrentUser = (callback:Function):any => async (dispatch:Dispatch) => {
  dispatch(requestUser());
  const response = await queryCurrentUser();
  if(!response || response.code!==0) {
    return dispatch(receivedUser(null));
  };
  callback && callback(response.data);
  dispatch(receivedUser(response.data));
}

export const requestUser = () => ({
  type: REQUEST_USER
});

export const receivedUser = (payload:any) => ({
  type: RECEIVED_USER,
  payload
})
