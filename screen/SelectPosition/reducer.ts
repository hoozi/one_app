import { AnyAction, Reducer } from 'redux';
import { REQUEST_OVERLOOK_FOR_YARD, RECEIVED_OVERLOOK_FOR_YARD, RECEIVED_AREA, RESET_MAP_DATA, RECEIVED_CTN, RESET_FIND_CTN  } from './actionType';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';

interface IState {
  data?:any;
  overLookReceiving: boolean;
  areas?:any;
  x: number[],
  y: number[],
  ctn: any[],
  scrollX: number;
}
const initialRootState:IState = {
  data: null,
  overLookReceiving: false,
  areas: {},
  x: [],
  y: [],
  ctn: [],
  scrollX: 0
}

const computedScrollX = (ctn:any, data:any[]) => {
  const w = 120;
  const {  } = ctn;
}

const overLook:Reducer = ( state = initialRootState, action:AnyAction ) => {
  const { type, payload } = action;
  switch(type) {
    case REQUEST_OVERLOOK_FOR_YARD:
      return { ...state, overLookReceiving: true }
    case RECEIVED_OVERLOOK_FOR_YARD:
      const { ctn } = state;
      const data = payload.map((item: any) => {
        const ctnList:any[] = item.ctnList.map((item:any) => item);
        //const rest:number = item.maxFloor - item.ctnList.length;
        let _ctnList = new Array(item.maxFloor).fill(null);
        if(ctnList.length) {
          const keys = keyBy(ctnList, 'floor');
          Object.keys(keys).forEach(key => {
            if(ctn.length && ctn[0].ctnNo === keys[key].ctnNo && ctn[0].floor === keys[key].floor) {
              keys[key]['find'] = true;
            }
            _ctnList[item.maxFloor-Number(key)] = keys[key];
          })
        }
        return {
          ...item,
          ctnList: _ctnList
        }
      });
      const x = data.map((item:any) => item.rows);
      const y = new Array(data[0].maxFloor).fill(0).map((item, index) => data[0].maxFloor - index);
      //const scrollX = state.ctn.length > 0 ? null : 0;
      return { ...state, overLookReceiving: false, data, x, y }
    case RECEIVED_AREA:
      const areas = groupBy(payload, 'areaCode');
      Object.keys(areas).forEach(key => {
        const len = areas[key].length * 2 - 1;
        const arr = new Array(len).fill(1);
        areas[key] = arr.map((item, index) => {
          return {
            areaCode: key,
            columns: index+1
          }
        });
      });
      return { ...state, areas }
      case RECEIVED_CTN:
        return { ...state, ctn: payload }
    case RESET_MAP_DATA:
      return { ...state, data:null, x:[], y:[], ctn:[], scrollX: 0 }
    case RESET_FIND_CTN:
      return { ...state, ctn: [] }
    default:
      return { ...state }
  }
}

export default overLook;