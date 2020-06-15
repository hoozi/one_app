import React, { useMemo, useCallback, useState, useEffect, useContext } from 'react';
import { createForm } from 'rc-form';
import { Button, Toast } from '@ant-design/react-native';
import { View, Text, Image, ImageBackground, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import CaiNiao from '../../icon/CaiNiao';
import { theme, service_url, color } from '../../constants';
import { fetchToken } from './action';
import { hasError } from '../../utils';
import { AuthContext } from '../../navigation';

export interface IInputProps {
  name?: string,
  props?: any,
  options?: any
}

export interface ILoginItemProps {
  item: IInputProps;
  onChange?: (value: string) => void;
  ref?: any;
  value?: string;
}

const inputPropsMap: IInputProps[] = [
  {
    name: 'username',
    props: {
      placeholder: '请输入用户名'
    },
    options: {
      rules: [
        {
          required: true,
          message: '请输入用户名'
        }
      ],
      //initialValue: 'admin'
    }
  },
  {
    name: 'password',
    props: {
      placeholder: '请输入密码'
    },
    options: {
      rules: [
        {
          required: true,
          message: '请输入密码'
        }
      ],
      //initialValue: 'iXB7te2ViIqBT8IbW3y4fA=='
    }
  }/* ,
  {
    name: 'code',
    props: {
      placeholder: '请输入验证码'
    },
    options: {
      rules: [
        {
          required: true,
          message: '请输入验证码'
        }
      ]
    }
  } */
]

const genCode = (randomStr:number):string => `${service_url}/code?randomStr=${randomStr}`

const LoginItem:React.FC<ILoginItemProps> = React.forwardRef((props, ref) => {
  const [uri, setUri] = useState(genCode(Date.now()))
  const { item, onChange, value } = props;
  const handleCodeChange = useCallback(() => {
    const now = Date.now();
    setUri(genCode(now))
  }, []);
  const input = useMemo(() => (
    <TextInput
      ref={ref}
      style={styles.textInput}
      value={value || ''}
      onChangeText={onChange}
      secureTextEntry={item.name==='password'} 
      underlineColorAndroid='transparent'
      placeholderTextColor='#d7d8dd'
      selectionColor={theme.color_text_base}
      returnKeyLabel='确定'
      returnKeyType='done'
      {...item.props}
    />
  ), 
  [value, item, onChange, uri])
  return (
    item.name === 'code' ? 
    <View style={styles.codeContainer}>
      {input}
      <TouchableOpacity onPress={handleCodeChange}>
        <Image style={styles.codeImage} resizeMode='stretch' source={{uri}}/>
      </TouchableOpacity>
    </View> :
    input
  )
});

const CloseButton:React.FC<any> = props => (
  <CaiNiao 
    onPress={() => props.navigation.goBack() } 
    name='cuowuguanbiquxiao' 
    size={32} 
    color={theme.color_text_base} 
    style={styles.loginClose}
  />
)

const Login:React.FC<any> = props => {
  const { form:{getFieldDecorator, validateFields,getFieldsError} } = props;
  const { state, dispatch } = useContext(AuthContext);
  const buttonDisabled = state.signing || hasError(getFieldsError());
  useEffect(() => {
    validateFields();
    return;
  }, []);
  const handleLoginSubmit = useCallback(() => {
    validateFields((error: any, values:any) => {
      if(error) return Toast.fail('用户名或密码必填!');
      dispatch(fetchToken(values))
    })
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor={color.fill_color}/>
      {/* <CloseButton navigation={props.navigation}/> */}
      <ImageBackground style={styles.loginContainer} source={require('../../assets/bg.png')} resizeMode='contain'>
        <View style={styles.loginForm}>
          <Text style={styles.loginFormTitle}>账号登录</Text>
          {
            inputPropsMap.map(props => 
              <View style={styles.textInputContainer} key={props.name}>
                {getFieldDecorator(props.name, {...props.options})(<LoginItem item={props}/>)}
              </View>
            )
          }
          <Button 
            type='primary' 
            style={[styles.loginButton, buttonDisabled && styles.loginButtonDisabled]} 
            disabled={buttonDisabled}
            onPress={handleLoginSubmit}
          >登 录</Button>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.fill_color
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginClose: {
    position: 'absolute',
    left: 24,
    top: 24,
    zIndex: 11
  },
  loginForm: {
    width: 400
  },
  loginFormTitle: {
    color: theme.color_text_base,
    fontFamily: 'PingFang',
    fontSize: 24,
    marginBottom: 32
  },
  textInputContainer: {
    borderBottomColor: '#d7d8dd',
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  textInput: {
    fontSize: 16,
    color: theme.color_text_base,
    width: 300
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  codeImage: {
    width: 100,
    height: 40
  },
  loginButton: {
    width: '100%',
    marginTop: 64,
    borderRadius: 100
  },
  loginButtonDisabled: {
    backgroundColor: '#d7d8dd',
    borderColor: '#d7d8dd',
    opacity: 1
  }
})

export default createForm()(Login);