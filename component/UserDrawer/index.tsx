import React from 'react';
import { Drawer } from '@ant-design/react-native';
import AccountSider from '../AccountSider';

const UserDrawer:React.FC<any> = props => {
  return (
    <Drawer
      open={props.open}
      sidebar={<AccountSider onSignOut={props.onSignOut}/>}
      drawerBackgroundColor='#fff'
      onOpenChange={(isOpen) => {
        props.dispatch({type: 'OPEN_DRAWER', payload: isOpen})
      }}
    >
      {props.children}
    </Drawer>
  )
}

export default UserDrawer;