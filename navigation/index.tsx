import React, { createContext, useCallback, useEffect, useReducer, useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, HeaderStyleInterpolators } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { navigationProps, loginNavigationProps } from './navigationProps';
import reducer from './reducer';
import { RootStackParamList, IInitialState } from './types';
import { token, warpDispatch, getUser } from '../utils';
import UserDrawer from '../component/UserDrawer';
import store from '../store';
import { openDrawer, setUserToState, signIn } from './action';

const { getToken } = token;
const RootStack = createStackNavigator<RootStackParamList>();
export const AuthContext:React.Context<any> = createContext({});
const initalState: IInitialState = {
  token: `${Date.now()}`,
  signing: false,
  drawerOpen: false,
  user: {}
}
interface ICurrentUser {
  sysUser?: any,
  permissions?: string[],
  roles?: number[]
}

const UserMiniInfo: React.FC<any> = props => {
  const { userInfo, onShowDrawer } = props;
  return (
    <TouchableOpacity onPress={() => onShowDrawer(true)}>
      <View style={styles.userMiniCard}>
        <Image style={styles.userAvatar} source={require('../assets/avatar.png')}/>
        <Text style={styles.userName}>{userInfo?.username}</Text>
      </View>
    </TouchableOpacity>
  )
}

const HeaderLeft:React.FC<any> = props => {
  return props.userInfo?.sysUser?.username ? (
    <UserMiniInfo onShowDrawer={props.onShowDrawer} userInfo={props.userInfo?.sysUser}/>
  ) : null
}

const AppNavigation:React.FC<{}> = (props) => {
  const [ state, dispatch ] = useReducer(reducer, initalState);
  useEffect(() => {
    const checkSign = async () => {
      let token;
      let user:any;
      try {
        token = await getToken();
        user = await getUser();
      } catch(e) {}
      
      dispatch(setUserToState({...JSON.parse(user)}));
      dispatch(signIn(token));
    }
    checkSign();
    return;
  }, []);
  const handleShowDrawer = useCallback((open: boolean) => {
    dispatch(openDrawer(open));
  }, []);
  return (
    <AuthContext.Provider value={{state, dispatch: warpDispatch(dispatch)}}>
      <UserDrawer open={state.drawerOpen} dispatch={dispatch} onSignOut={() => {
        dispatch(openDrawer(false));
        navigationRef.current?.navigate('SignOutPlaceholder')
      }}>
        <NavigationContainer ref={navigationRef}>
          <RootStack.Navigator screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyleInterpolator: HeaderStyleInterpolators.forSlideLeft,
            headerLeft: () => <HeaderLeft userInfo={state.user} onShowDrawer={handleShowDrawer} dispatch={dispatch}/>
          }}>
            {
              state.token ? 
              navigationProps.map(props => <RootStack.Screen {...props}/>) :
              <RootStack.Screen {...loginNavigationProps}/>
            }
          </RootStack.Navigator>
        </NavigationContainer>
      </UserDrawer>
    </AuthContext.Provider>
  )
}

const navigationRef: React.RefObject<any> = React.createRef();
export function navigate(name?:string, params?: any) {
  navigationRef.current?.navigate(name, params);
}
export function goBack() {
  navigationRef.current?.goBack();
}

export default () => {
  return (
    <Provider store={store}>
      <AppNavigation/>
    </Provider>
  )
};

const styles = StyleSheet.create({
  userMiniCard: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userAvatar: {
    width: 36,
    height: 36,
    marginLeft: 16,
    marginRight: 8
  },
  userName: {
    color: '#fff',
    fontSize: 16
  }
})