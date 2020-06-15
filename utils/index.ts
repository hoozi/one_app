import * as CryptoJS from 'crypto-js';
import { AsyncStorage } from 'react-native';
import { Dispatch } from 'react';
import maxBy from 'lodash/maxBy';
import request from './request';
import * as token from './token';

const { setItem, getItem, removeItem } = AsyncStorage;
const userKey:string = 'user';

export interface IEncryption {
  data: any;
  type?: string;
  param: string[];
  key: string
}

export const hasError = (fieldsError:any):boolean => Object.keys(fieldsError).some(field => fieldsError[field]);

export const encryption = (params:IEncryption):any => {
  const {
    data,
    type,
    param,
    key
  } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    
  } else {
    param.forEach((ele:string) => {
      const data = result[ele]
      const _key = CryptoJS.enc.Latin1.parse(key)
      
      // 加密
      const encrypted = CryptoJS.AES.encrypt(
        data,
        _key, 
        {
          iv: _key,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        })
      result[ele] = encrypted.toString()
    })
  }
  return result
}

export const warpDispatch = (dispatch:Dispatch<any>) => {
  return (action:any) => {
    if(typeof action === 'function') {
      action(dispatch)
    } else {
      dispatch(action)
    }
  }
}

export const getMaxRowColumn = function(data:any[], name:string) {
  const mapedData = data.map((item:any) => item); 
  let max;
  let _data = [mapedData[0]];
  const spliceData = mapedData.splice(1);
  spliceData.forEach((item:any) => {
    if(_data[_data.length-1][name] < item[name]) {
      _data = [item]
    } else if(_data[_data.length-1][name] === item[name]) {
      _data.push(item);
    }
  });
  if(_data.length===1) {
    max = _data[0];
  } else if(_data.length > 1) {
    max = maxBy(_data, (item:any) => item[`${name === 'columns' ? 'maxColumn' : 'maxRow'}`]);
  }
  return max;
}

export async function setUser(user:string) {
  return setItem(userKey, user);
}
export async function getUser() {
  return getItem(userKey);
}
export async function removeUser() {
  return removeItem(userKey);
}
export { request, token }
