import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { columns_type } from '../index';
import { color } from '../../../constants';

interface IProps {
  columns: columns_type
}

const Header:React.FC<IProps> = props => {
  const { columns } = props;
  return (
    <View style={{...styles.tableHeader,width: columns.reduce((sum:number,cur:any) => sum+(cur.width || 100), 0)}}>
      {
        columns.map((column, index) => <Text key={column.key || index} style={{...styles.tableTh, width: column.width || 100, textAlign: column.align}}>{column.title}</Text>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  tableHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height:32,
    backgroundColor: '#fafafa'
  },
  tableTh: {
    paddingHorizontal: 8,
    fontWeight: 'bold',
    fontSize: 14,
    color: color.text_base_color,
    alignItems: 'center'
  }
})

export default Header