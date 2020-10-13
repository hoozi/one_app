import { Toast } from '@ant-design/react-native';
import groupBy from 'lodash/groupBy';
import { Dispatch } from 'redux';
import { queryMoveListForWharf, queryMoveListForYard, queryMoveListForYard2, queryMoveListForYardBack, updateMoveListForWharf, updateMoveListForYard, updateMoveListForYardBack, updateMoveListForNone, updateMoveListWhenNoCtnNo } from '../../api/moveList';
import { REQUEST_MOVELIST, RECEIVED_MOVELIST, UPDATING_MOVELIST, UPDATED_MOVELIST } from './actionType';
import { IGroup,record } from './reducer';
import { moveListStatusMap } from '../../constants';

const mapService:{ [key:string] : any } = {
  'truck': queryMoveListForYard,
  'move': queryMoveListForYard2,
  'back': queryMoveListForYardBack
}

export const fetchMoveList = (payload:any={}, type:string='yard', vt:string='truck'):any => async (dispatch:Dispatch) => {
  dispatch(requestMoveList());
  const { callback, ...params } = payload;
  const queryMoveList = type === 'yard' ? mapService[vt] : queryMoveListForWharf
  const response = await queryMoveList(params);
  if(!response || response.code!==0) {
    dispatch(receivedMoveList({records:[],group:{}}));
    return;
  };
  const { records=[] } = response.data;
  const mapedRecords = records.map((item:record) => {
    Object.keys(item).forEach((key) => {
      switch(key) {
        case 'applyType' :
          item.applyTypeName = moveListStatusMap[item[key]];
        break;
        case 'ieFlag' :
          item.ieFlagName = item[key] === 'I' ? '内贸' : '外贸';
        break;
      }
    });
    return { ...item }
  })
  const group:IGroup = groupBy(mapedRecords.filter((r:record) => r.numberPlate), 'numberPlate');
  const moves = mapedRecords.filter((r:record) => r.applyType === 'M');
  dispatch(receivedMoveList({
    records:mapedRecords, 
    group,
    trucks: Object.keys(group), 
    moves
  }));
  callback && callback(group);
}

interface ITypes {
  [key: string]: Function
}

const types:ITypes = {
  'yard': updateMoveListForYard,
  'wharf': updateMoveListForWharf,
  'back': updateMoveListForYardBack,
  'none': updateMoveListForNone
}

export const updateWhenNoCtnNo = (payload: any, callback?:Function) => async (dispatch: Dispatch) => {
  dispatch(updating());
  const response = await updateMoveListWhenNoCtnNo(payload);
  if(!response || response.code!==0) {
    dispatch(updated());
    return;
  };
  dispatch(updated());
  callback && callback();
}

export const update = (payload:any, vt:string='truck', callback?:Function) => async (dispatch: Dispatch) => {
  dispatch(updating());
  const { type, ...params } = payload;
  const updateMoveList = types[vt === 'back' ? 'back' : type];
  const response = await updateMoveList({...params});
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