import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pagination } from '@ant-design/react-native';
import TableHeader from './component/Header';
import TableBody from './component/Body';

export interface IColumn {
  dataIndex?:string,
  title?:string,
  render?(item?:any, data?:any, index?:number):any,
  align?: 'left' | 'center' | 'right'
  key?:string
}

export type columns_type = IColumn[];

export interface IProps {
  columns?:columns_type,
  data:[]
}

const Table:React.FC<IProps> = props => {
  const { columns=[], data } = props;
  return (
    <View style={styles.tableContainer}>
      <TableHeader columns={columns}/>
      <TableBody data={data} columns={columns}/>
    </View>
  )
}

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
    margin:16,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth
  }
})

export default Table;