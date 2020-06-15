import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Toast } from '@ant-design/react-native';
import { View, SafeAreaView, StyleSheet, StatusBar, FlatList, Text, TouchableHighlight } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { color } from '../../constants';
import { fetchMoveList, update } from './action';
import Sidebar from '../../component/Sidebar';
import Field from '../../component/Field';
import CaiNiao from '../../icon/CaiNiao';
import Empty from '../../component/Empty';
import CenterLoading from '../../component/CenterLoading';

const fieldRows = [
  {
    title: '集卡号',
    dataIndex: 'numberPlate',
    need: (data:any) => data.applyType !== 'SHIPMENT' && data.applyType !== 'UNLOADSHIP'
  },
  {
    title: '船名/航次',
    dataIndex: '_',
    render: (val:string, data:any) => `${data.vesselEname}/${data.voyage}`,
    need: (data:any) => data.applyType === 'SHIPMENT' || data.applyType === 'UNLOADSHIP'
  }, 
  {
    title: '箱型尺寸',
    dataIndex: 'ctnSizeType'
  },
  {
    title: '箱主',
    dataIndex: 'ctnOwner'
  },
  {
    title: '内外贸',
    dataIndex: 'ieFlagName'
  }
]
const TaskCard: React.FC<any> = props => {
  const { data, navigation, onOk, buttonLoading } = props;
  const fromPosition = `${data.areaCode || '-'}/${data.rowCode || '-'}/${data.columnName || '-'}/${data.floor || '-'}`;
  const toPosition = `${data.moveAreaCode || '-'}/${data.moveRowCode || '-'}/${data.moveColumnName || '-'}/${data.moveFloor || '-'}`;
  const position = data.areaCode ? fromPosition : toPosition;
  return (
      <View style={styles.taskCard}>
        <View style={styles.taskCardHeader}>
          <Text style={styles.taskCardHeaderText}>
            {data.ctnNo}
          </Text>
          <Text style={styles.status}>
            {data.applyTypeName}
          </Text>
          <Button 
            type='primary' 
            size='small' 
            loading={buttonLoading}
            disabled={buttonLoading}
            style={styles.okButton} 
            onPress={() => onOk && onOk(data)}>
              <Text style={{fontWeight: 'bold', fontSize: 15}}>确 认</Text>
          </Button>
        </View>
        <View style={styles.taskCardBody}>
          <Field
            type='column'
            rows={fieldRows}
            data={data}
          />
        </View>
        <TouchableHighlight underlayColor='transparent' onPress={() => {
          return data.applyType === 'T' || data.applyType === 'SHIPMENT' ? null : navigation.navigate('SelectPosition', {
            position:data.applyType === 'M' ? toPosition : position,
            id: data.id
          });
        }} style={{width: '100%'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 8}}>
            <View style={styles.taskCardFooter}>
              <View style={styles.cardListItem}>
                <Text style={styles.fieldName}>原位置(区/列/贝/层)</Text>
                <Text style={styles.fieldValue}>{fromPosition}</Text>
              </View>
              <View style={styles.cardListItem}>
                <Text style={styles.fieldName}>目的位置(区/列/贝/层)</Text>
                <Text style={styles.fieldValue}>{toPosition}</Text>
              </View>
            </View>
            {
                (data.applyType !== 'T' && data.applyType !== 'SHIPMENT') &&
                <CaiNiao name='xiayiyeqianjinchakangengduo' size={22} color={color.text_base_color}/>
              }
          </View>
        </TouchableHighlight>
      </View>
    
  )
}

const Home:React.FC<any> = props => {
  const [searchType, setSearchType] = useState<string>('yard');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { records,receiving,updating } = useSelector((state:any) => state.moveList);
  const dispatch = useDispatch();
  const handleSiteSubmit = useCallback((data) => {
    dispatch(update({...data, type:searchType}, () => {
      Toast.success('提交成功',1,() => {
        dispatch(fetchMoveList({}, searchType));
      });
    }));
  }, [searchType]);
  const getMoveList = useCallback((payload:any={}, type:string=searchType) => {
    dispatch(fetchMoveList(payload, type));
  },[searchType]);
  const handleMoveListRefresh = useCallback(() => {
    setRefreshing(true);
    getMoveList({
      callback() {
        setRefreshing(false);
      }
    }, searchType)
  }, [searchType, refreshing])
  useFocusEffect(
    useCallback(
    () => {
      getMoveList({}, searchType)
      return;
    },[searchType])
  );
  const handleTabChange = useCallback((selected, item) => {
    setSearchType(item.value)
    getMoveList({},item.value);
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.brand_color} barStyle='light-content'/>
      <Sidebar sideItems={[
        {
          title: (type: string) => <><CaiNiao name='zitigui' size={16} color={type === 'active' ? color.text_base_color: '#fff'}/> 堆场</>,
          value: 'yard'
        }]} onSelectedChange={handleTabChange}/>
      {
        receiving && !refreshing ?
        <CenterLoading/> :
        records.length > 0 ?
        <FlatList
          keyExtractor={item => item.id+''}
          style={{flex: 1}}
          data={records}
          onRefresh={handleMoveListRefresh}
          refreshing={refreshing}
          renderItem = {({item}) => <TaskCard navigation={props.navigation} onOk={handleSiteSubmit} data={item} buttonLoading={updating}/>}
          contentContainerStyle={{paddingHorizontal: 16}}
        /> : <Empty/>
      }
      
      {/* <Table columns={[
        {
          title:'箱号',
          align: 'center',
          dataIndex: 'ctnNo'
        },
        {
          title: '集卡号',
          align: 'center',
          dataIndex: 'numberPlate'
        },
        {
          title:'类型',
          dataIndex: 'applyTypeName',
          align: 'center',
          render: value => <Text style={{color:color.brand_color, fontSize:12}}>{value}</Text>
        },
        {
          title: '箱型尺寸',
          align: 'center',
          dataIndex: 'ctnSizeType'
        },
        {
          title: '箱主',
          align: 'center',
          dataIndex: 'ctnOwner'
        },
        {
          title: '内外贸',
          align: 'center',
          dataIndex: 'ieFlagName'
        },
        {
          title: '位置',
          align: 'center',
          render: () => <Text>A1/c1/b1/f1</Text>
        }
      ]}
      data={moveList.records}/> */}
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: color.fill_color
  },
  tableButton: {
    borderRadius: 100,
    paddingLeft: 8,
    paddingRight: 8
  },
  taskCard: {
    borderRadius: 4,
    flex: 1,
    marginTop: 16,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(50, 59, 90, 0.15)',
    overflow: 'hidden'
  },
  taskCardHeader: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(50, 59, 90, 0.15)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  taskCardHeaderText: {
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: color.text_base_color,
    marginLeft:26
  },
  taskCardHeaderStatus: {
    fontSize: 16,
    color: color.brand_color
  },
  taskCardBody: {
    paddingVertical: 8,
    backgroundColor: '#fafafa',
    flexDirection: 'row'
  },
  taskCardFooter: {
    paddingVertical: 12,
    flex:1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(50, 59, 90, 0.15)',
  },
  cardListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  fieldName: {
    fontSize: 14,
    marginRight: 2,
    color: 'rgba(50, 59, 90, 0.5)'
  },
  fieldValue: {
    fontSize: 14,
    color: 'rgba(50, 59, 90, 0.8)'
  },
  okButton: {
    borderRadius: 100,
    height: 32,
    paddingLeft: 24,
    paddingRight: 24
  },
  status: {
    width: 84,
    paddingTop: 1,
    paddingBottom: 1,
    transform: [
      {
        rotate: '-45deg',
      },
    ],
    position: 'absolute',
    left: -22,
    top: 10,
    backgroundColor: color.brand_color,
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    overflow: 'hidden',
  }
})

export default Home;