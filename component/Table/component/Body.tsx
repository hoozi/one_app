import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { columns_type } from '../index';

/* interface IRow {
  columns: any;
  data?:{},
  index: number
} */
interface IProps {
  columns: columns_type;
  data:[];
}

interface IAlign {
  [key: string]: any;
}

const alignMap:IAlign = {
  'left':'flex-start',
  'center': 'center',
  'right': 'flex-end'
}

const Row:React.FC<any> = props => {
  const { data, columns, index } = props;
  return (
    <View style={styles.tableRow}>
      {
        columns.map((column:any) => {
          const { align='left' } = column;
          const alignItems = alignMap[align];
          return (
            column.render ? 
            <View style={{...styles.tableTd, alignItems}}>{column.render(data[column.dataIndex], data, index)}</View> : 
            <Text style={{...styles.tableTd, textAlign: align}}>{data[column.dataIndex]}</Text>
          )
        })
      }
    </View>
  )
}

const Body:React.FC<IProps> = props => {
  const { data, columns } = props;
  
  return (
    <View style={{height:320}}>
      {
        data.map((item, index:number) => {
          return <Row data={item} columns={columns} index={index}/>
        })
      }
    </View>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ededed',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height:32,
    backgroundColor: '#fff'
  },
  tableTd: {
    paddingHorizontal: 8,
    flex: 1,
    fontSize: 12
  }
})

export default Body