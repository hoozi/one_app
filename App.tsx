import React from 'react';
import AppNavigation from './navigation';
import {
  StatusBar,
} from 'react-native';
import { Provider } from '@ant-design/react-native';
import { theme } from './constants';

const App = () => {
  return (
    <Provider theme={theme}>
      <StatusBar backgroundColor='transparent' barStyle='dark-content' />
      <AppNavigation/>
    </Provider>
  );
};

export default App;
