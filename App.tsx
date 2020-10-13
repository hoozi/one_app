import React from 'react';
import AppNavigation from './navigation';
import {
  StatusBar
} from 'react-native';
import { Provider, Toast } from '@ant-design/react-native';
import { theme } from './constants';
Toast.config({
  duration: 1
})
const App = () => {
  return (
    <Provider theme={theme}>
      <StatusBar backgroundColor='transparent' barStyle='dark-content' />
      <AppNavigation/>
    </Provider>
  );
};

export default App;
