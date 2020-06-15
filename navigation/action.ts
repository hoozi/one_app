import { OPEN_DRAWER, SET_USER, SIGN_IN, SIGN_OUT, SIGNING } from './actionType';

export const openDrawer = (payload: any) => ({
  type: OPEN_DRAWER,
  payload
});

export const setUserToState = (payload: any) => ({
  type: SET_USER,
  payload
});

export const signIn = (payload: any) => ({
  type: SIGN_IN,
  payload
});

export const signing = () => ({
  type: SIGNING
})

export const signOut = () => ({
  type: SIGN_OUT
})

