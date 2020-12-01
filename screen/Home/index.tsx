import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Toast, List, Modal } from '@ant-design/react-native';
import { 
  View, 
  SafeAreaView, 
  StyleSheet, 
  StatusBar, 
  FlatList, 
  Text, 
  TouchableHighlight,
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { color } from '../../constants';
import { fetchMoveList, update, updateWhenNoCtnNo, updateCtnNo } from './action';
import Sidebar from '../../component/Sidebar';
import Field from '../../component/Field';
import CaiNiao from '../../icon/CaiNiao';
import Empty from '../../component/Empty';
import CenterLoading from '../../component/CenterLoading';
import { RECORD_TYPE } from './reducer';
import { reject } from 'lodash';
const TaskCard: React.FC<any> = props => {
  const { data, navigation, onOk, buttonLoading, vt, onEditCtnNo } = props;
  const fromPosition = `${data.areaCode || '-'}/${data.columnName || '-'}/${data.rowCode || '-'}/${data.floor || '-'}`;
  const toPosition = `${data.moveAreaCode || '-'}/${data.moveColumnName || '-'}/${data.moveRowCode || '-'}/${data.moveFloor || '-'}`;
  const position = data.areaCode ? fromPosition : toPosition;
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
  if(vt === 'load') {
    fieldRows.push({
      title: '轨道号',
      dataIndex: 'platNo'
    })
  }
  return (
      <View style={styles.taskCard}>
        <View style={styles.taskCardHeader}>
          {
            vt === 'move' && !data.ctnNo ?
            <Button 
              type='primary' 
              size='small'
              style={{...styles.okButton, marginLeft: 24}} 
              onPress={() => onEditCtnNo && onEditCtnNo(data)}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>补全箱号</Text>
            </Button> :
            <Text style={styles.taskCardHeaderText}>
              {data.ctnNo} {data.normalFlag ? <Text style={{color: data.normalFlag === 'Y' ? '#52c41a' : '#f5222d'}}>{data.normalFlag === 'Y' ? '好箱' : '坏箱'}</Text> : ''}
            </Text>
          }
          <Text style={styles.status}>
            {data.applyTypeName}
          </Text>
          {
            vt!=='back' &&
            <Button 
              type='primary' 
              size='small' 
              loading={buttonLoading}
              disabled={buttonLoading}
              style={styles.okButton} 
              onPress={() => onOk && onOk(data)}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>确 认</Text>
            </Button>
          }
        </View>
        <View style={{
          flexDirection:'row', 
          padding: 8, 
          borderTopWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderTopColor: 'rgba(50, 59, 90, 0.15)',
          borderBottomColor: 'rgba(50, 59, 90, 0.15)',
        }}>
          <Text style={{fontSize: 14, marginRight: 4, color: 'rgba(50, 59, 90, 0.5)'}}>备注</Text>
          <Text style={{fontSize: 14, color: 'rgba(50, 59, 90, 0.8)'}}>{data.remark}</Text>
        </View>
        <View style={styles.taskCardBody}>
          <Field
            type='column'
            rows={fieldRows}
            data={data}
          />
        </View>
        <TouchableHighlight underlayColor='transparent' onPress={() => {
          return vt!=='back' && (data.applyType === 'SHIPMENT' ) || vt==='load' ? null : navigation.navigate('SelectPosition', {
            position:data.applyType === 'M' ? toPosition : position,
            id: data.id,
            vt
          });
        }} style={{width: '100%'}}>
          <View style={{
            flexDirection: 'row',  
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: 'rgba(50, 59, 90, 0.15)', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingRight: 8
          }}>
            <View style={styles.taskCardFooter}>
              <View style={styles.cardListItem}>
                <Text style={styles.fieldName}>原位置(区/贝/列/层)</Text>
                <Text style={styles.fieldValue}>{fromPosition}</Text>
              </View>
              <View style={styles.cardListItem}>
                <Text style={styles.fieldName}>目的位置(区/贝/列/层)</Text>
                <Text style={styles.fieldValue}>{toPosition}</Text>
              </View>
            </View>
            {
              (vt==='back' || data.applyType !== 'SHIPMENT' && vt!=='load') &&
              <CaiNiao name='xiayiyeqianjinchakangengduo' size={22} color={color.text_base_color}/>
            }
          </View>
        </TouchableHighlight>
      </View>
    
  )
}

const Home:React.FC<any> = props => {
  const { records,moves,trucks,receiving,updating } = useSelector((state:any) => state.moveList);
  const group = useSelector((state:any) => state.moveList.group);
  const [truckActive, setTruckActive] = useState<number|null>(null);
  const [searchType, setSearchType] = useState<string>('yard');
  const [viewType, setViewType] = useState<string>('I');
  //const [list, setListByTruckNo] = useState<Array<RECORD_TYPE>>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useDispatch();
  const handleSiteSubmit = useCallback((data) => {
    if(data.applyType === 'T') {
      if(data.ctnNo &&!data.areaCode) {
        return Toast.fail('原位置不能为空');
      } else if(!data.ctnNo) {
        return Modal.prompt(
          '输入箱号',
          '请补全箱号信息',
          ctnNo => new Promise((resolve, reject) => {
            try {
              dispatch(updateWhenNoCtnNo({
                appMove: data,
                ctnNo
              },() => {
                Toast.success('提交成功', 1, () => {
                  resolve();
                  getMoveList({}, searchType, viewType, 0);
                });
              }))
            } catch(e) {
              reject();
            }
          }),
          'default',
          undefined,
          ['请输入']
        )
      }
    }
    dispatch(update({...data, type:searchType}, viewType, () => {
      Toast.success('提交成功', 1, () => {
        getMoveList({}, searchType, viewType, 0);
      });
    }));
  }, [searchType, trucks, group]);
  const handleEditCtnNo = useCallback(data => {
    Modal.prompt(
      '输入箱号',
      '请补全箱号信息',
      ctnNo => new Promise((resolve, reject) => {
        if(!ctnNo) return;
        try {
          dispatch(updateCtnNo({
            ...data,
            ctnNo
          },() => {
            Toast.success('提交成功', 1, () => {
              resolve();
              getMoveList({}, searchType, viewType, 0);
            });
          }))
        } catch(e) {
          reject();
        }
      }),
      'default',
      undefined,
      ['请输入']
    )
  },[])
  const getMoveList = useCallback((payload:any={}, type:string=searchType, vt:string, ta:number | null ) => {
    const { callback, ...restPayload } = payload;
    dispatch(fetchMoveList({
      ...restPayload,
      callback(group:any) {
        if(vt === 'truck' || vt === 'back') {
          const truckNo = trucks[ta??0];
          setTruckActive(ta)
          //setListByTruckNo(group[truckNo]);
        }
        setViewType(vt);
        callback && callback();
      }
    }, type, vt));
  },[searchType, trucks]);
  const handleMoveListRefresh = useCallback((vt:string, ta:number) => {
    setRefreshing(true);
    getMoveList({
      callback() {
        setRefreshing(false);
      }
    }, searchType, vt, ta)
  }, [searchType, refreshing])
  const handleSelectTruck = useCallback((index,t) => {
    const currentList = group[t];
   // setListByTruckNo(currentList);
    setTruckActive(index);
  }, [group])
  useFocusEffect(
    useCallback(
    () => {
      getMoveList({}, searchType, viewType, 0)
    },[searchType, viewType])
  );
  const handleTabChange = useCallback((selected, item) => {
    setSearchType(item.value);
    setViewType(item.extra);
    setTruckActive(0);
    getMoveList({},item.value, item.extra, truckActive);
  }, [truckActive]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.brand_color} barStyle='light-content'/>
      <Sidebar sideItems={[
        {
          title: '进箱',
          value: 'yard',
          extra: 'I'
        },
        {
          title: '提箱',
          value: 'yard',
          extra: 'T'
        },
        {
          title: '移箱',
          value: 'yard',
          extra: 'move'
        },
        {
          title: '回退',
          value: 'yard',
          extra: 'back'
        }
        ]} onSelectedChange={handleTabChange}/>
      {
        receiving && !refreshing ?
        <CenterLoading/> :
        records.length > 0 ?
        <FlatList
          keyExtractor={item => item.id+''}
          style={{flex: 1}}
          data={records}
          onRefresh={() => handleMoveListRefresh(viewType, 0)}
          refreshing={refreshing}
          renderItem = {({item}) => <TaskCard onEditCtnNo={handleEditCtnNo} vt={viewType} navigation={props.navigation} onOk={handleSiteSubmit} data={item} buttonLoading={updating}/>}
          contentContainerStyle={{paddingHorizontal: 16}}
        /> :
        <Empty>
          <View style={styles.emptyChildContainer}>
            <Text style={{fontSize: 16, color:'#84899c'}}>暂无数据</Text>
            <TouchableOpacity onPress={() => getMoveList({}, searchType, viewType, 0)}>
              <Text style={styles.refresh}>刷新重试</Text>
            </TouchableOpacity>
          </View>
        </Empty> 
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
    //borderBottomWidth: StyleSheet.hairlineWidth,
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
    flex:1
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
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  emptyChildContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  refresh: {
    color: color.brand_color,
    fontSize: 16,
    marginLeft:4
  }
})

export default Home;