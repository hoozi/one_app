import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle, TouchableHighlight, TouchableOpacity } from 'react-native';
import { color } from '../../constants';
import Empty from '../Empty';

interface BayMapProps {
  x: number[];
  y: number[];
  sx: number;
  data: any;
  selected: any[];
  max: number;
  onChange(values:any[]):void;
  //isBig: boolean
}
const BayMap:React.FC<BayMapProps> = ({
  x,
  y,
  sx=0,
  data,
  selected,
  onChange,
  max,
 // isBig
}) => {
  const axisYRef:any = React.useRef();
  const axisXRef:any = React.useRef();
  const sv:any = React.useRef(null);
  const handleSelectedChange = React.useCallback((value, type) => {
    const _selected = type === 'delete' ? [...selected.filter(item => {
      if(item.id === value.id) {
        return item._floor!==value._floor;
      }
      return true;
    })] : (max === 1 ? [value] : [...selected,value]);
    if(_selected.length > max) return;
    onChange(_selected);
  }, [selected]);
  React.useEffect(() => {
    sv.current && sv.current.scrollTo({
      x: sx
    })
  }, [sx,sv])
  return (
    <View style={styles.container}>
      {
        data ? 
        <React.Fragment>
          <View style={styles.axisX} ref={x => axisXRef.current = x}>
            <Text style={{
              ...styles.axisItemX, 
              fontWeight: 'bold', 
              backgroundColor: color.brand_color, 
              color:'#fff', 
              borderColor: color.brand_color, 
              borderLeftWidth: StyleSheet.hairlineWidth
            }}>{data[0].areaCode}区 {data[0].columnName}贝</Text>
            {
              x.map(item => <Text key={item} style={styles.axisItemX}>{item}列</Text>)
            }
          </View>
          <View style={styles.axisY} ref={y => axisYRef.current = y}>
            {
              y.map((item, index) => <Text key={item} style={styles.axisItemY}>{item}层</Text>)
            }
          </View>
          <View style={{width: '100%'}}>
            <ScrollView onScroll={e=>{
              axisYRef.current.setNativeProps({
                style: {
                  top: -e.nativeEvent.contentOffset.y
                }
              })
            }}>
              <ScrollView 
                horizontal 
                ref={sv}
                showsHorizontalScrollIndicator={false} 
                onScroll={e=>{
                  axisXRef.current.setNativeProps({
                    style: {
                      left: -e.nativeEvent.contentOffset.x
                    }
                  })
                }}
                contentContainerStyle={styles.gridContainer}
              >
                {
                  selected.map(item => {
                    return data[0].areaId === item.areaId && data[0].columnName === item.columnName ? 
                    <TouchableOpacity key={`${item._rows}_${item._floor}`} onPress={() => {
                      handleSelectedChange({
                        ...item
                      }, 'delete')
                    }}
                    style={{position: 'absolute',left: (item._rows-1)*120, top: (item.f-1)*60, backgroundColor: '#52c41a', width: 120, height: 60, zIndex: 11}}
                    >
                    </TouchableOpacity> : null
                  })
                }
                {
                  data.map((item: any) => {
                    return (
                      <View key={`${item.id}_${item.rows}`}>
                        {
                          item.ctnList.map((ctn:any, index:number) => (
                          <TouchableHighlight key={`${item.id}_${item.rows}_${index}`} underlayColor='#eee' 
                            onPress={() => handleSelectedChange({
                              ...item,
                              _rows: item.rows,
                              _columnName: item.columnName,
                              _floor: item.maxFloor-index,
                              f: index+1
                            }, 'add')} style={styles.gridItem}>
                              <React.Fragment>
                                {
                                  ctn ? 
                                  <View style={{
                                    borderWidth: StyleSheet.hairlineWidth,
                                    borderColor: ctn.find ? '#ffe7ba' : '#bae7ff',
                                    backgroundColor: ctn.find ? '#fa8c16' : '#e6f7ff',
                                    height: '100%',
                                    width: '100%',
                                    borderRadius: 4,
                                    justifyContent: 'center',
                                    paddingLeft: 8
                                  }}>
                                    <Text style={{fontSize: 12, color:color.brand_color}}>{ctn.ctnNo}</Text>
                                    <Text style={{fontSize: 12, color:color.brand_color}}>{ctn.ctnOwner}  {ctn.ctnSizeType} <Text style={{color: ctn.normalFlag === 'Y' ? '#52c41a' : '#f5222d'}}>{ctn.normalFlag === 'Y' ? '好箱' : '坏箱'}</Text></Text>
                                  </View> : 
                                  null
                                }
                              </React.Fragment>
                            </TouchableHighlight>
                          ))
                        }
                      </View>
                    )
                  })
                }
              </ScrollView>
            </ScrollView>
          </View>
        </React.Fragment> :
        null
      }
      
    </View>
  );
}

const axisItem:TextStyle = {
  //marginLeft: -StyleSheet.hairlineWidth,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: '#e0e0e0',
  //borderRightWidth: 0,
  width: 120,
  height: 60,
  lineHeight: 60,
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center'
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    position: 'relative',
    paddingTop:42,
    paddingLeft: 120,
    margin: 6,
    overflow: 'hidden'
  },
  axisX: {
    position: 'absolute',
    zIndex: 10,
    flex:1,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row'
  },
  axisY: {
    position: 'absolute',
    backgroundColor: '#f9f9f9',
    marginTop:42
  },
  axisItem,
  axisItemX: {
    ...axisItem,
    borderLeftWidth: 0,
    lineHeight: 42,
    height: 42
  },
  axisItemY: {
    ...axisItem,
    borderTopWidth: 0
  },
  gridItem: {
    ...axisItem,
    //marginLeft: -StyleSheet.hairlineWidth*2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#fff',
    padding: 6
  },
  gridContainer: {
    flexDirection: 'row',
    position: 'relative'
  }
})

export default BayMap;