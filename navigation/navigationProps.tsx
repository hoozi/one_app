import React from 'react';
import { Text,TouchableOpacity } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { ROOT_NAME_TYPE } from './types';
import { headerOptions } from '../constants';
import Home from '../screen/Home';
import Login from '../screen/Login';
import SignOutPlaceholder from '../screen/SignOutPlaceholder';
import SelectPosition from '../screen/SelectPosition';
import CaiNiao from '../icon/CaiNiao';

export interface INavigationProps {
  name: ROOT_NAME_TYPE;
  key: string;
  component: React.ComponentType<any>;
  initialParams?: any;
  modal?: boolean;
  options?: {};
  children?: INavigationProps[]
}

export const navigationProps:INavigationProps[] = [
  {
    name: 'Home',
    key: 'Home',
    component: Home,
    options({navigation}:any){
      return {
        title: '在场机械',
        ...headerOptions,
        headerRight: ( {tintColor}:any) => (
          <TouchableOpacity onPress={() => navigation.navigate('SelectPosition',{max:2})}>
            <Text style={{color:tintColor, fontSize: 18, paddingHorizontal: 16}}>堆场剖面图<CaiNiao name='xiayiyeqianjinchakangengduo' size={18} color={tintColor}/></Text>
          </TouchableOpacity>
        )
      }
    }
  },
  {
    name: 'SignOutPlaceholder',
    key: 'SignOutPlaceholder',
    component: SignOutPlaceholder,
    options: {
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      ...headerOptions
    }
  },
  {
    name: 'SelectPosition',
    key: 'SelectPosition',
    component: SelectPosition,
    options: {
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
    }
  }
];

export const loginNavigationProps:INavigationProps = {
  name: 'Login',
  key: 'Login',
  component: Login,
  options: {
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
    ...headerOptions
  }
}
