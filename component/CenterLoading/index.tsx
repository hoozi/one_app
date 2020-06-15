import React from 'react';
import { View, StyleSheet } from 'react-native'
import { ActivityIndicator } from '@ant-design/react-native';
import { color as constColor } from '../../constants';

interface IProp {
  text?:string,
  color?:string
}

const CenterLoading:React.FC<IProp> = ({ text='加载中...', color=constColor.brand_color }) => {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator color={color} text={text}/>
    </View>
  )
}

const styles = StyleSheet.create({
  centerContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default CenterLoading;