import { AnyAction } from "redux";

export interface ILoginState {
  received: boolean;
}

const initialState: ILoginState = {
  received: false
}

export default function login(state = initialState, action: AnyAction) {
  return { ...state }
}