import React, { useCallback, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { Button, Toast } from '@ant-design/react-native';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from '../../navigation';
import { getMaxRowColumn } from '../../utils';
import { fetchOverLookForYard } from './action';
import { update } from '../Home/action';
import OverLookWrap from '../../component/OverLook';
import BayMap from '../../component/BayMap';
import { color,moveListUpdateType } from '../../constants';
import CenterLoading from '../../component/CenterLoading';
const data = [{"id":36466,"areaId":595,"rows":1,"columns":1,"columnName":"1","name":"1","status":0,"floor":1,"flag":0,"maxFloor":7,"ctnList":[{"id":4823,"ctnNo":"TTNU9649410","numberPlate":"ZBASD","ctnSizeType":"20GP","sealNo":"","ctnOwner":"TSL","shipperAgentCode":"","forwarderCode":"","shipperCode":null,"vesselEname":"MAERSK JAIPUR","voyage":"ASD","closeDate":null,"loadPortCode":null,"deliveryPortCode":null,"discPortCode":null,"ieFlag":null,"areaCode":"B","rowCode":1,"columnName":1,"ctnLocationColumn":1,"floor":1,"applyUser":null,"applyTime":null,"confirmUser":"堆场管理","confirmTime":"2020-08-24 11:43:52","workUser":"堆场管理","workTime":"2020-08-24 11:43:57","takePlace":"","returnPlace":"HFDC","normalFlag":"Y","efFlag":"E","grossWeight":null,"tareWeight":null,"netWeight":null,"billNo":null,"inApplyId":3237,"outApplyId":null,"storageDays":2,"inTime":"2020-08-24 11:43:58","outTime":null,"planFlag":"N","lockCtn":"N","makeCtnTime":null,"inRemark":"","outRemark":null,"shapeCode":""}]},{"id":36486,"areaId":595,"rows":2,"columns":1,"columnName":"1","name":"2","status":0,"floor":1,"flag":1,"maxFloor":7,"ctnList":[]},{"id":36506,"areaId":595,"rows":3,"columns":1,"columnName":"1","name":"3","status":0,"floor":1,"flag":1,"maxFloor":7,"ctnList":[]},{"id":36526,"areaId":595,"rows":4,"columns":1,"columnName":"1","name":"4","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36546,"areaId":595,"rows":5,"columns":1,"columnName":"1","name":"5","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36566,"areaId":595,"rows":6,"columns":1,"columnName":"1","name":"6","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36586,"areaId":595,"rows":7,"columns":1,"columnName":"1","name":"7","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36606,"areaId":595,"rows":8,"columns":1,"columnName":"1","name":"8","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36626,"areaId":595,"rows":9,"columns":1,"columnName":"1","name":"9","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36646,"areaId":595,"rows":10,"columns":1,"columnName":"1","name":"10","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36666,"areaId":595,"rows":11,"columns":1,"columnName":"1","name":"11","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36686,"areaId":595,"rows":12,"columns":1,"columnName":"1","name":"12","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36706,"areaId":595,"rows":13,"columns":1,"columnName":"1","name":"13","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36726,"areaId":595,"rows":14,"columns":1,"columnName":"1","name":"14","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36746,"areaId":595,"rows":15,"columns":1,"columnName":"1","name":"15","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36766,"areaId":595,"rows":16,"columns":1,"columnName":"1","name":"16","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36786,"areaId":595,"rows":17,"columns":1,"columnName":"1","name":"17","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36806,"areaId":595,"rows":18,"columns":1,"columnName":"1","name":"18","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36826,"areaId":595,"rows":19,"columns":1,"columnName":"1","name":"19","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36846,"areaId":595,"rows":20,"columns":1,"columnName":"1","name":"20","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36866,"areaId":595,"rows":21,"columns":1,"columnName":"1","name":"21","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36886,"areaId":595,"rows":22,"columns":1,"columnName":"1","name":"22","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36906,"areaId":595,"rows":23,"columns":1,"columnName":"1","name":"23","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36926,"areaId":595,"rows":24,"columns":1,"columnName":"1","name":"24","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]},{"id":36946,"areaId":595,"rows":25,"columns":1,"columnName":"1","name":"25","status":0,"floor":0,"flag":0,"maxFloor":7,"ctnList":[]}]
const x = data.map(item => item.rows);
const y = new Array(data[0].maxFloor).fill(0).map((item, index) => data[0].maxFloor - index);
const mapData = data.map(item => {
  const ctnList:any[] = item.ctnList.map(item => item);
  const rest:number = y.length - item.ctnList.length;
  for(let i=0; i < rest; i++) {
    ctnList.unshift(null)
  }
  return {
    ...item,
    ctnList
  }
});
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
        from[key] = key === 'floor' ? data[0][from[key]] - 1 : data[0][from[key]];
      });
      Object.keys(to).forEach(key => {
        to[key] = data[1][to[key]];
      });
      return { ...from, ...to }
  }
}

const moveDataBySelected = (selected:any):string =>  `${selected.areaCode}区 ${selected._rows}列 ${selected._columnName}贝 ${selected._floor}层`

const SelectPosition:React.FC<any> = props => {
  const [selectedList, setSelectedList] = useState<any[]>([]);
  const [visiable, setVisiable] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>({});
  const [mapSize, setMapSize] = useState<any>({mapWidth:0,mapHeight:0});
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { data, overLookReceiving } = useSelector((state:any) => state.overLook);
  const { records,updating } = useSelector((state:any) => state.moveList);
  const { id, position='', vt, max=1 } = props.route.params;
  const handleSelectedSite = useCallback((selected) => {
    if(selectedList !== selected) {
      if(selected.length) {
        selected[selected.length-1]._columnName = parseInt(currentRow?.ctnSizeType,10) >= 40 ? Number(selected[selected.length-1]._columnName) + 1 : selected[selected.length-1]._columnName;
      }
      setSelectedList(selected)
    }
  }, [selectedList,currentRow]);
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
        //props.navigation.goBack();
        setVisiable(false);
        dispatch(fetchOverLookForYard(() => {
          setVisiable(true);
          setSelectedList([])
        }))
      });
    }))
  }, [currentRow, selectedList, visiable])
  useFocusEffect(
    useCallback(() => {
      isFocused && dispatch(fetchOverLookForYard((data:any) => {
        const mapMaxRow = getMaxRowColumn(data.areaList, 'rows');
        const mapMaxColumn = getMaxRowColumn(data.areaList, 'columns');
        const mapWidth = ( mapMaxColumn.columns+mapMaxColumn.maxColumn ) * 90;
        const mapHeight = ( mapMaxRow.rows+mapMaxRow.maxRow ) * 45;
        const getCurrentRowById = records.filter((item:any) => item.id === id);
        setMapSize({ mapWidth, mapHeight })
        setCurrentRow(getCurrentRowById[0]);
        setVisiable(true);
      }));
      //return;
    }, [isFocused, records])
  );
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
      <View style={{flex:1}}>
        {
          overLookReceiving ? 
          <CenterLoading/> :
          <BayMap x={x} y={y} data={mapData}/>
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
          <Button type='ghost' size='small' style={styles.radiusButton} onPress={() => goBack()}>取 消</Button>
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
  }
})

export default SelectPosition;