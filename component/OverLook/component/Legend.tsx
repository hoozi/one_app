import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export interface IRow {
  color?: string;
  text: string;
  type?:string
}
interface IProps {
  data?:IRow[];
  visiable?:boolean
}

const SelectedList:React.FC<IProps> = props => {
  const { data=[], visiable = true } = props;
  return (
    <>
    {
      visiable &&
      <View style={{...styles.legendContainer, height: (data?.length+1)*24+24}}>
        <Text style={styles.legendTitle}>图例</Text>
        {
          data?.map((item:IRow, index:number) => {
            return(
              <View style={styles.legendItem} key={index}>
                {
                  item.type === 'image' ? 
                  <View style={styles.legendColor}><ImageBackground source={require('./selected.jpg')} resizeMode='cover' style={styles.legendColor}/></View> :
                  <View style={{...styles.legendColor,backgroundColor: item.color}}></View>
                }
                <Text style={styles.legendText}>{item.text}</Text>
              </View>
            )
          })
        }
      </View>
    }
    </>
  )
}

const styles = StyleSheet.create({
  legendContainer: {
    padding: 8,
    width: 100,
    backgroundColor: 'rgba(0,0,0,0.75)',
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 10
  },
  legendTitle: {
    fontSize:14,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 24
  },
  legendColor: {
    width: 32,
    height: 16
  },
  legendText: {
    fontSize:12,
    color: '#fff'
  }
})

export default SelectedList