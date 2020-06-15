import React, { useCallback } from 'react';
import { View, Text, StyleSheet,SafeAreaView } from 'react-native';
import { Button } from '@ant-design/react-native';
const AccountSider:React.FC<any> = props => {
  const handleSignOut = useCallback(() => {
    props.onSignOut && props.onSignOut()
  }, [])
  return (
    <SafeAreaView style={styles.sideContainer}>
      <View style={{position: 'absolute',left:0,right:0,top:0,bottom:0}}>
        {/* <Text>231</Text> */}
        <View style={styles.signOutButtonContainer}>
          <Button type='warning' style={styles.signOutButton} onPress={handleSignOut}>退出登录</Button>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  sideContainer: {
    width: '100%',
    flex:1,
    backgroundColor: '#fff',
  },
  signOutButtonContainer: {
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
  signOutButton: {
    borderRadius: 100,
    width: '100%'
  },
  userInfoList: {
    paddingHorizontal: 16
  }
})

export default AccountSider;