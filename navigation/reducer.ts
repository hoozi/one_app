import { AnyAction, Reducer } from 'redux';
import { SIGN_IN, SIGNING, SIGN_OUT, OPEN_DRAWER, SET_USER } from './actionType';

const reducer:Reducer = ( prevState, action:AnyAction ) => {
  const { type, payload } = action;
  switch(type) {
    case SIGN_IN:
      return {
        ...prevState,
        token: payload,
        signing: false
      };
    case SIGNING:
      return {
        ...prevState,
        token: null,
        signing: true
      };
    case SIGN_OUT:
      return {
        ...prevState,
        token: null,
        signing: false
      };
    case OPEN_DRAWER:
      return {
        ...prevState,
        drawerOpen: payload
      }
    case SET_USER:
      const user = { ...prevState.user, ...payload }
      return {
        ...prevState,
        user
      }
    default: 
      return { ...prevState }
  }
}

export default reducer;