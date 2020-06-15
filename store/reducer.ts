import { combineReducers, AnyAction, Reducer } from 'redux';
import { REQUEST_USER, RECEIVED_USER } from './actionType';
import login from '../screen/Login/reducer';
import moveList from '../screen/Home/reducer';
import overLook from '../screen/SelectPosition/reducer';

interface IRootState {
  user?: any;
}
const initialRootState:IRootState = {
  user: {
    userReceiving: false,
    data: {}
  }
}

const common:Reducer = ( state = initialRootState, action:AnyAction ) => {
  const { type, payload } = action;
  let user;
  switch(type) {
    case REQUEST_USER:
      user = { ...state.user, userReceiving: true}
      return { ...state,user}
    case RECEIVED_USER:
      user = { ...state.user, userReceiving: false, data: payload}
      return { ...state,user}
    default:
      return { ...state }
  }
}

export default combineReducers({
  common,
  login,
  moveList,
  overLook
})