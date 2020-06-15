import { combineReducers, AnyAction, Reducer } from 'redux';
import { REQUEST_OVERLOOK_FOR_YARD, RECEIVED_OVERLOOK_FOR_YARD  } from './actionType';


interface IState {
  data?:any;
  overLookReceiving: boolean
}
const initialRootState:IState = {
  data: null,
  overLookReceiving: false
}

const overLook:Reducer = ( state = initialRootState, action:AnyAction ) => {
  const { type, payload } = action;
  switch(type) {
    case REQUEST_OVERLOOK_FOR_YARD:
      return { ...state, overLookReceiving: true }
    case RECEIVED_OVERLOOK_FOR_YARD:
      const data = payload?.areaList.map((area:any) => {
        const locationList = area.locationList.map((site:any, index:number) => {
          const _delete:boolean = index >= 1 && area.locationList[index-1].flag === 1;
          return {
            ...site,
            _delete
          }
        });
        return {
          ...area,
          locationList
        }
      });
      return { ...state.overLook, overLookReceiving: false, data }
    default:
      return { ...state }
  }
}

export default overLook;