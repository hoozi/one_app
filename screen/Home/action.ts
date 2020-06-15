import { Toast } from '@ant-design/react-native';
import { Dispatch } from 'redux';
import { queryMoveListForWharf, queryMoveListForYard, updateMoveListForWharf, updateMoveListForYard, updateMoveListForNone } from '../../api/moveList';
import { REQUEST_MOVELIST, RECEIVED_MOVELIST, UPDATING_MOVELIST, UPDATED_MOVELIST } from './actionType';

export const fetchMoveList = (payload:any={}, type:string='yard'):any => async (dispatch:Dispatch) => {
  dispatch(requestMoveList());
  const { callback, ...params } = payload;
  const queryMoveList = type === 'yard' ? queryMoveListForYard : queryMoveListForWharf
  const response = await queryMoveList(params);
  if(!response || response.code!==0) {
    dispatch(receivedMoveList({records:[]}));
    return;
  };
  dispatch(receivedMoveList(response.data));
  callback && callback();
}

interface ITypes {
  [key: string]: Function
}

const types:ITypes = {
  'yard': updateMoveListForYard,
  'wharf': updateMoveListForWharf,
  'none': updateMoveListForNone
}

export const update = (payload:any, callback?:Function) => async (dispatch: Dispatch) => {
  dispatch(updating());
  const { type, ...params } = payload;
  const updateMoveList = types[type];
  const response = await updateMoveList({params,size: 999});
  if(!response || response.code!==0) {
    dispatch(updated());
    return;
  };
  dispatch(updated());
  callback && callback();
}

export const requestMoveList = () => ({
  type: REQUEST_MOVELIST
});

export const receivedMoveList = (payload:any) => ({
  type: RECEIVED_MOVELIST,
  payload
});

export const updating = () => ({
  type: UPDATING_MOVELIST
});

export const updated = () => ({
  type: UPDATED_MOVELIST
})