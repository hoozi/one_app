import { AnyAction } from 'redux';
import { REQUEST_MOVELIST, RECEIVED_MOVELIST, UPDATING_MOVELIST, UPDATED_MOVELIST } from './actionType';
import { Toast, Portal } from '@ant-design/react-native';

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

export interface IGroup {
  [key:string]: Array<RECORD_TYPE>
}

export interface IInitialState {
  records: Array<RECORD_TYPE>;
  group: IGroup;
  moves: Array<RECORD_TYPE>;
  trucks: Array<string>;
  receiving: boolean;
  updating: boolean;
}

const initialState:IInitialState = {
  records: [],
  moves: [],
  trucks: [],
  group: {},
  receiving: false,
  updating: false
}

let key:number = -999;

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
        ...payload,
        receiving: false,
      }
    case UPDATING_MOVELIST:
      key = Toast.loading('提交中...', 0)
      return {
        ...state,
        updating: true
      }
    case UPDATED_MOVELIST:
      Portal.remove(key);
      return {
        ...state,
        updating: false
      }
    default:
      return {...state}
  }
}