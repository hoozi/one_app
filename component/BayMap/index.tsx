import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { color } from '../../constants';

interface BayMapProps {
  x: number[],
  y: number[],
  data: any
}
const BayMap:React.FC<BayMapProps> = ({
  x,
  y,
  data
}) => {
  const axisYRef:any = React.useRef();
  const axisXRef:any = React.useRef();
  return (
    <View style={styles.container}>
      <View style={styles.axisX} ref={x => axisXRef.current = x}>
        <Text style={{
          ...styles.axisItemX, 
          fontWeight: 'bold', 
          backgroundColor: color.brand_color, 
          color:'#fff', 
          borderColor: color.brand_color, 
          borderLeftWidth: StyleSheet.hairlineWidth
        }}>3贝</Text>
        {
          x.map(item => <Text style={styles.axisItemX}>{item}列</Text>)
        }
      </View>
      <View style={styles.axisY} ref={y => axisYRef.current = y}>
        {
          y.map((item, index) => <Text style={styles.axisItemY}>{item}层</Text>)
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
              data.map((item: { ctnList: any[]; }) => {
                return (
                  <View>
                    {
                      item.ctnList.map(ctn => <View style={styles.gridItem}>
                        {
                          ctn ? 
                          <View style={{
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: '#bae7ff',
                            backgroundColor: '#e6f7ff',
                            height: '100%',
                            width: '100%',
                            borderRadius: 4,
                            justifyContent: 'center',
                            paddingLeft: 8
                          }}>
                            <Text style={{fontSize: 12, color:color.brand_color}}>{ctn.ctnNo}</Text>
                            <Text style={{fontSize: 12, color:color.brand_color}}>{ctn.ctnOwner}  {ctn.ctnSizeType}</Text>
                          </View> : 
                          null
                        }
                      </View>)
                    }
                  </View>
                )
              })
            }
          
          
        </ScrollView>
        </ScrollView>
      </View>
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
    paddingLeft: 120
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
    flexDirection: 'row'
  }
})

export default BayMap;