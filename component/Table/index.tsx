import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Pagination } from '@ant-design/react-native';
import TableHeader from './component/Header';
import TableBody from './component/Body';

export interface IColumn {
  dataIndex?:string,
  title?:string,
  render?(item?:any, data?:any, index?:number):any,
  align?: 'left' | 'center' | 'right';
  key?:string;
  width?:number
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
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'column'
        }}
      >
        <TableHeader columns={columns}/>
        <TableBody data={data} columns={columns}/>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth
  }
})

export default Table;