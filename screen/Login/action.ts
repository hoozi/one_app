import { Dispatch } from 'react';
import { navigate } from '../../navigation';
import { Toast,Portal } from '@ant-design/react-native';
import { queryToken } from '../../api/user';
import { encryption, token, setUser } from '../../utils';
import { fetchCurrentUser } from '../../store/action';
import store from '../../store';
import { signIn, signing, setUserToState } from '../../navigation/action';

interface ILoginParam {
  username: string,
  password: string,
  code: string
}

export function fetchToken(payload:ILoginParam): Function {
  
  const params = encryption({
    data: payload,
    key: 'weihuangweihuang',
    param: ['password']
  });

  return async (dispatch:Dispatch<any>) => {
    const toastKey = Toast.loading('登录中...', 0);
    dispatch(signing());
    const response = await queryToken({
      ...params,
      grant_type: 'password',
      scope: 'server',
      randomStr: Date.now()
    });
    if(!response || !response.access_token) {
      Portal.remove(toastKey);
      return dispatch(signIn(null))
    };
    await token.setToken(response.access_token);
    dispatch(signIn(response.access_token));
    store.dispatch(fetchCurrentUser(async (user:any) => {
      await setUser(JSON.stringify(user));
      dispatch(setUserToState({...user}))
      Portal.remove(toastKey);
      navigate('Home');
    }));
  }
}