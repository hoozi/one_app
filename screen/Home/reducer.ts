import { AnyAction } from 'redux';
import { REQUEST_MOVELIST, RECEIVED_MOVELIST, UPDATING_MOVELIST, UPDATED_MOVELIST } from './actionType';
import { moveListStatusMap } from '../../constants';


export interface record {
  applyType: any, 
  areaCode: string | null, 
  columnName: string | null, 
  ctnNo: string | null, 
  ctnOwner: string | null, 
  ctnSizeType: string | null, 
  floor: number | null, 
  id: number | null, 
  ieFlag: string | null, 
  moveAreaCode: string | null, 
  moveColumnName: number | null, 
  moveFloor: number | null, 
  moveRowCode: number | null, 
  numberPlate: string | null, 
  overFlag: string | null, 
  rowCode: string | null,
  [key: string]: any
}

export type RECORD_TYPE = Partial<record>;

export interface IInitialState {
  records: RECORD_TYPE[],
  receiving: boolean,
  updating: boolean
}

const initialState:IInitialState = {
  records: [],
  receiving: false,
  updating: false
}

export default function moveList(state=initialState, action:AnyAction) {
  const { type, payload } = action;
  switch(type) {
    case REQUEST_MOVELIST:
      return {
        ...state,
        receiving: true
      }
    case RECEIVED_MOVELIST:
      return {
        ...state,
        receiving: false,
        records: payload.records.map((item:RECORD_TYPE) => {
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
      }
    case UPDATING_MOVELIST:
      return {
        ...state,
        updating: true
      }
    case UPDATED_MOVELIST:
      return {
        ...state,
        updating: false
      }
    default:
      return {...state}
  }
}