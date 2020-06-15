import React, { useContext, useEffect } from 'react';
import { Portal, Toast } from '@ant-design/react-native';
import { AuthContext } from '../../navigation';
import { setUserToState, signOut } from '../../navigation/action'
import { token, removeUser } from '../../utils';

const { removeToken } = token;
const SignOutPlaceholder:React.FC<any> = props => {
  const { dispatch } = useContext(AuthContext);
  useEffect(() => {
    const signOutAsync = async () => {
      const signOutToast = Toast.loading('注销中...',0);
      try {
        await removeToken();
        await removeUser();
        dispatch(setUserToState({}))
        dispatch(signOut());
      } catch(e) {}
      Portal.remove(signOutToast);
    }
    signOutAsync();
    return;
  }, [])
  return null
}

export default SignOutPlaceholder;