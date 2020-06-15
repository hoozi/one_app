import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CaiNiao from '../../icon/CaiNiao';
import { Button } from '@ant-design/react-native';
import { color } from '../../constants';

const DetailSider:React.FC<any> = props => {
  const { data, onSubmit, submiting } = props;
  return (
    <View style={styles.sideContainer}>
      <View style={styles.sideHeader}>
        <Text style={styles.sideHeaderText}>{data.ctnNo}</Text>
        <Text style={styles.sideHeaderStatus}>{data.applyTypeName}</Text>
      </View>
      <View style={styles.sideBody}>
        <View style={styles.sideItem}>
          <Text style={styles.sideFieldName}>集卡号</Text>
          <Text style={styles.sideFieldValue}>{data.numberPlate}</Text>
        </View>
        <View style={styles.sideItem}>
          <Text style={styles.sideFieldName}>内外贸</Text>
          <Text style={styles.sideFieldValue}>{data.ieFlagName}</Text>
        </View>
        <View style={styles.sideItem}>
          <Text style={styles.sideFieldName}>位置(区/贝/排/层)</Text>
          <Text style={styles.sideFieldValue}>F/1/1/1 <CaiNiao name='bianjishuru' size={18} color={color.brand_color}/></Text>
        </View>
      </View>
      <View style={styles.drawerButtonContainer}>
        <Button type='primary' style={[styles.drawerButton, submiting && styles.drawerDisabledButton]} onPress={() => onSubmit && onSubmit(data)} disabled={submiting}>提交</Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sideContainer: {
    width: '100%',
    flex:1,
    backgroundColor: '#fff',
  },
  sideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomColor: 'rgba(50, 59, 90, 0.15)',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  sideHeaderText: {
    fontSize: 18,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: color.text_base_color
  },
  sideHeaderStatus: {
    color: color.brand_color,
    fontSize: 18
  },
  sideBody: {
    
    marginHorizontal: 12
  },
  sideItem: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'rgba(50, 59, 90, 0.15)',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  sideFieldName: {
    fontSize: 16,
    color: 'rgba(50, 59, 90, 0.5)'
  },
  sideFieldValue: {
    fontSize: 16,
    color: 'rgba(50, 59, 90, 0.8)'
  },
  drawerButtonContainer: {
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
  drawerButton: {
    borderRadius: 100,
    width: '100%'
  },
  drawerDisabledButton: {
    backgroundColor: '#d7d8dd',
    borderColor: '#d7d8dd',
    opacity: 1
  }
})


export default DetailSider;