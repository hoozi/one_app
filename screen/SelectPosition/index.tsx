import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableHighlight, TextInput, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Toast } from '@ant-design/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from '../../navigation';
import { fetchOverLookForYard, fetchArea, fetchCtnInfo, resetFindCtn } from './action';
import { update } from '../Home/action';
import OverLookWrap from '../../component/OverLook';
import BayMap from '../../component/BayMap';
import { color,moveListUpdateType } from '../../constants';
import CenterLoading from '../../component/CenterLoading';

const fieldMap: { [key:string]: {[key:string]: string} } = {
  'I': {
    'areaCode': 'moveAreaCode',
    'columnName': 'moveColumnName'
  },
  'T': {
    'areaCode': 'areaCode',
    'columnName': 'columnName'
  },
  'M': {
    'areaCode': 'moveAreaCode',
    'columnName': 'moveColumnName'
  }
}

/* <OverLook 
            {...mapSize}
            controlType={currentRow?.applyType}
            isBig={parseInt(currentRow?.ctnSizeType,10) >= 40}
            visiable={visiable} 
            data={data} 
            vt={vt}
            selected={selectedList} 
            onSelectedSite={handleSelectedSite}
            defaultSites={[position]}
            max={max}
          /> */

/* 'T': 'yard',
'I': 'yard',
'M': 'yard',
'SHIPMENT': 'wharf',
'UNLOADSHIP': 'wharf' */
/* const fromPosition = `${data.areaCode || '-'}/${data.rowCode || '-'}/${data.columnName || '-'}/${data.floor || '-'}`;
  const toPosition = `${data.moveAreaCode || '-'}/${data.moveRowCode || '-'}/${data.moveColumnName || '-'}/${data.moveFloor || '-'}`; */
const wh = Dimensions.get('screen');
const OverLook = OverLookWrap({
  viewHeight: wh.height-100
});

const updatePositionByType = (data:any, type?:string):any => {
  const from:any = {'areaCode':'areaCode', 'rowCode':'_rows', 'columnName':'_columnName', 'floor':'_floor'};
  const to:any ={'moveAreaCode':'areaCode','moveRowCode':'_rows','moveColumnName':'_columnName','moveFloor':'_floor'}; 
  switch(type) {
    case 'I':
    case 'M':
      Object.keys(to).forEach(key => {
        to[key] = data[to[key]];
      });
      return {...to};
    case 'T':
      Object.keys(from).forEach(key => {
        from[key] = data[from[key]];
      });
      return {...from};
    case 'UNLOADSHIP':
      Object.keys(to).forEach(key => {
        to[key] = data[to[key]];
      });
      return {...to};
    case 'M_FOR_OVERLOOK':
      Object.keys(from).forEach(key => {
        from[key] = data[0][from[key]];
      });
      Object.keys(to).forEach(key => {
        to[key] = data[1][to[key]];
      });
      return { ...from, ...to }
  }
}

const moveDataBySelected = (selected:any):string =>  `${selected.areaCode}区 ${selected._rows}列 ${selected._columnName}贝 ${selected._floor}层`

const SelectPosition:React.FC<any> = props => {
  const currentRowRef = React.useRef<any>();
  const [selectedList, setSelectedList] = useState<any[]>([]);
  const [active, setActive] = useState<any>({areaCode: 0, bayCode: 0})
  const [visiable, setVisiable] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [sx, setSx] = useState<number>(0);
  const dispatch = useDispatch();
  const { data, overLookReceiving, areas,x,y,ctn } = useSelector((state:any) => state.overLook);
  const { records,updating } = useSelector((state:any) => state.moveList);
  const { id, vt, max=1 } = props.route.params;
  const handleSelectedSite = useCallback((selected) => {
    const currentRow = currentRowRef.current;
    if(selected.length) {
      const isBig=parseInt(currentRow?.ctnSizeType,10) >= 40;
      const isOdd = selected.length && selected[0].columnName % 2 !== 0;
      if(currentRow?.id) {
        if(isBig && isOdd) {
          return Toast.info('大箱不能放在奇数贝上', 1)
        } else if(!isBig && !isOdd) {
          return Toast.info('小箱不能放在偶数贝上', 1)
        }
      }
    }
    setSelectedList(selected)
  }, [setSelectedList]);
  const handleSubmit = useCallback(() => {
    const positionParams = max === 1 ? [selectedList[0], vt === 'back' ? 'I' : currentRow.applyType] : [selectedList, 'M_FOR_OVERLOOK']
    if(max >=2 && selectedList.length < max) {
      return Toast.fail('可视化移箱缺少目的位置')
    }
    dispatch(update({ 
        ...currentRow, 
        ...updatePositionByType(positionParams[0], positionParams[1]), 
        type: max === 1 ? moveListUpdateType[currentRow.applyType] : 'none'
      },
      vt,
      () => {
      Toast.success('提交成功',1,() => {
        setVisiable(false);
        setSelectedList([]);
        dispatch(resetFindCtn());
        props.navigation.goBack();
        if(max > 1) {
          dispatch(fetchOverLookForYard({areaCode:data[0].areaCode, columnName: data[0].columnName},() => {
            setSelectedList([]);
            dispatch(resetFindCtn())
          }))
        }
      });
    }))
  }, [currentRow, selectedList, visiable]);
  useEffect(() => {
    if(!ctn.length) return setSx(0);
    const { areaCode, columnName, rowCode } = ctn[0];
    setSx((rowCode - 1) * 120);
    dispatch(fetchOverLookForYard({
      areaCode,
      columnName
    }));
    setActive({
      areaCode,
      bayCode:columnName
    });
  }, [ctn]);
  useFocusEffect(
    useCallback(() => {
      const getCurrentRowById = records.filter((item:any) => item.id === id);
      setCurrentRow({...getCurrentRowById[0]});
      currentRowRef.current = {...getCurrentRowById[0]}
      dispatch(fetchArea(() => {
        const { applyType } = getCurrentRowById[0] || {};
        if(vt==='back' || max > 1) return;
        const areaCode = getCurrentRowById[0][fieldMap[applyType].areaCode];
        const columnName = getCurrentRowById[0][fieldMap[applyType].columnName];
        console.log(fieldMap[applyType].areaCode, areaCode, columnName);
        (areaCode && columnName) && dispatch(fetchOverLookForYard({
          areaCode,
          columnName
        }));
        setActive({
          areaCode: areaCode,
          bayCode: columnName
        });
      }));
      //return;
    }, [records])
  );
  const handleSearchCtn = useCallback(e => {
    const ctnNo = e.nativeEvent.text.trim();
    if(!ctnNo) return;
    dispatch(fetchCtnInfo(ctnNo))
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        {
          currentRow?.id && max === 1 ? 
          <>
            <View>
              <Text style={styles.topBarText}>{currentRow.applyTypeName}</Text>
              <Text style={styles.topBarFeildName}>类型</Text>
            </View>
            {
              (currentRow.applyType === 'SHIPMENT' || currentRow.applyType === 'UNLOADSHIP') ? 
              <View>
                <Text style={styles.topBarText}>{`${currentRow.vesselEname}/${currentRow.voyage}`}</Text>
                <Text style={styles.topBarFeildName}>船名/航次</Text>
              </View> :
              <View>
                <Text style={styles.topBarText}>{currentRow.numberPlate}</Text>
                <Text style={styles.topBarFeildName}>集卡号</Text>
              </View>
            }  
            <View>
              <Text style={styles.topBarText}>{currentRow.ctnNo}</Text>
              <Text style={styles.topBarFeildName}>箱号</Text>
            </View>
            <View>
              <Text style={styles.topBarText}>{currentRow.ctnSizeType}</Text>
              <Text style={styles.topBarFeildName}>箱型尺寸</Text>
            </View>
            <View>
              <Text style={styles.topBarText}>{currentRow.ctnOwner}</Text>
              <Text style={styles.topBarFeildName}>箱主</Text>
            </View>
            <View>
              <Text style={styles.topBarText}>{currentRow.ieFlagName}</Text>
              <Text style={styles.topBarFeildName}>内外贸</Text>
            </View>
          </> : 
          max === 2 ?
          <Text style={styles.topBarText}>可视化移箱</Text> :
          null
        }
      </View>
      <View style={{flex:1, flexDirection: 'row'}}>
        <View style={styles.sideBar}>
          {
            JSON.stringify(areas) !== '{}' ? 
            <React.Fragment>
              <View style={{padding:6, borderBottomColor: '#e0e0e0', borderBottomWidth: StyleSheet.hairlineWidth}}>
                <TextInput 
                  placeholder='搜索箱号' 
                  placeholderTextColor='#e0e0e0' 
                  returnKeyType='search'
                  onSubmitEditing={handleSearchCtn}
                  style={{margin:0,padding:0}}/>
              </View>
              <View style={{flex:1,flexDirection: 'row'}}>
              <View style={{height: '100%', flex:1, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: '#e0e0e0'}}>
                <ScrollView>
                  {
                    Object.keys(areas).map((item, index) => {
                      return (
                        <TouchableHighlight 
                          key={item} 
                          underlayColor='#eee' 
                          onPress={() => {
                            if(active.areaCode!==item) {
                              dispatch({
                                type: 'RESET_MAP_DATA'
                              });
                              setActive({
                                areaCode: item,
                                areaCodeIndex: index,
                                bayCodeIndex: -1,
                                bayCode: ''
                              })
                            }
                          }} 
                          style={{...styles.sideBarItem, backgroundColor: active.areaCode === item ? color.brand_color : '#fff'}}
                        >
                          <Text style={{color: active.areaCode === item ? '#fff' : '#333'}}>{item}区</Text>
                        </TouchableHighlight>
                      )
                    })
                  }
                  
                </ScrollView>
              </View>
              <View style={{height: '100%', flex:1}}>
                <ScrollView>
                  {
                    active.areaCode ? areas[active.areaCode].map((item: any, index:number) => {
                      return (
                        <TouchableHighlight 
                          key={`${active.areaCode}_${item.columns}`} 
                          underlayColor='#eee' 
                          onPress={() => {
                            dispatch(fetchOverLookForYard({
                              areaCode: active.areaCode,
                              columnName: item.columns
                            }));
                            setActive({
                              ...active,
                              bayCode: item.columns,
                              bayCodeIndex: index
                            })
                          }} 
                          style={{...styles.sideBarItem, backgroundColor: active.bayCode === item.columns ? color.brand_color : '#fff'}}
                        >
                          <Text style={{color: active.bayCode === item.columns ? '#fff' : '#333'}}>{item.columns}贝</Text>
                        </TouchableHighlight>
                      )
                    }) : null
                  }
                </ScrollView>
              </View>
              </View>
            </React.Fragment> : null
          }
        </View>
        {
          overLookReceiving ? 
          <CenterLoading/> :
          <BayMap sx={sx} max={max} x={x} y={y} data={data} selected={selectedList} onChange={handleSelectedSite}/>
        }
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.selectedArea}>
          {
            !selectedList.length ?
            <Text style={styles.noneText}>请选择箱位</Text> :
            selectedList.length === 1 ?
            <Text style={styles.positionTag}>已选:{moveDataBySelected(selectedList[0])}</Text> :
            <Text style={styles.positionTag}>{moveDataBySelected(selectedList[0])} --{">"} {moveDataBySelected(selectedList[1])}</Text>
          }
        </View>
        <View style={styles.inlineButton}>
          <Button type='ghost' size='small' style={styles.radiusButton} onPress={() => {
            dispatch({
              type: 'RESET_MAP_DATA'
            });
            goBack();
          }}>取 消</Button>
          <Button type='primary' size='small' style={styles.radiusButton} onPress={handleSubmit} disabled={updating} loading={updating}>提 交</Button>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  topBar: {
    height: 50,
    backgroundColor: color.brand_color, 
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  topBarText: {
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: 100
  },
  topBarFeildName: {
    color: '#85b0ff'
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: '#fff',
    elevation: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inlineButton: {
    flexDirection: 'row'
  },
  radiusButton: {
    borderRadius: 100,
    marginLeft: 12,
    height: 32,
    paddingLeft: 24,
    paddingRight: 24
  },
  selectedArea: {

  },
  noneText: {
    color: '#84899c'
  },
  positionTag: {
    color: color.brand_color,
    fontWeight: 'bold',
    fontSize: 14
  },
  sideBar: {
    height: '100%', 
    backgroundColor: '#fff', 
    position:'relative', 
    zIndex: 12, 
    width: 150
  },
  sideBarItem: {
    width: '100%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: StyleSheet.hairlineWidth
  }
})

export default SelectPosition;