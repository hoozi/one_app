import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type need_type = (data:any) => boolean;

interface IRow {
  dataIndex?:string,
  title?:string,
  render?(val:string, data:any):any,
  key?:string,
  need?: boolean | need_type
}

interface IProps {
  rows?:IRow[],
  data?:[],
  noneText?:string,
  type?:string
}

interface IDir {
  [key: string]: any;
}

const dirMap:IDir = {
  'row': {
    flexDirection:'column',
    justifyContent: 'space-between'
  },
  'column': {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}

const Field:React.FC<IProps> = props => {
  const { rows=[], data, type='row', noneText='-' } = props;
  return (
    <View style={{...styles.fieldList, ...dirMap[type]}}>
      {
        rows.map((item:IRow, index:number) => {
          const { need=true, ...restItem } = item;
          const needRender = typeof need === 'function' ? need(data) : need
          return needRender ? <FieldItem key={item.key || index} item={restItem} data={data} noneText={noneText}/> : null
        })
      }
    </View>
  )
}

export const FieldItem:React.FC<any> = props => {
  const { data, item, noneText } = props;
  const { title, render, dataIndex } = item;
  return (
    <View style={styles.fieldListItem}>
      <Text style={styles.fieldName}>{ title }</Text>
      <Text style={styles.fieldValue}>{typeof render === 'function' ? render(data[dataIndex], data) : data[dataIndex] || noneText}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  fieldList: {
    flexDirection: 'column',
    flex: 1
  },
  fieldListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 4
  },
  fieldName: {
    fontSize: 14,
    marginRight: 4,
    color: 'rgba(50, 59, 90, 0.5)'
  },
  fieldValue: {
    fontSize: 14,
    color: 'rgba(50, 59, 90, 0.8)'
  },
})

export default Field;
