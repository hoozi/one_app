import React, { useContext, useCallback, useState } from 'react';
import { OverLookContext } from '../index';
import { G } from 'react-native-svg';
import Axis from './Axis';
import SiteList from './SiteList';
import { Modal } from '@ant-design/react-native';

interface IProps {
  x?: number;
  y?: number;
  areas?: any[];
  onSelected?(selected:any[]):void;
}

const Area:React.FC<IProps> = props => {
  const { areas, onSelected } = props;
  const { siteWidth, siteHeight, selected, isBig, max } = useContext(OverLookContext);
  const handleSelectSite = useCallback((site, area) => {
    if(area.maxFloor < (site.floor+1)) {
      return Modal.alert('温馨提示',`此箱位已经到达箱区最大层数`)
    }
    const siteX = site.rows;
    const siteY = site.columns;
    const areaX = !area ? 0 : area.rows-1;
    const areaY = !area ? 0 : area.columns-1;
    const selectedSite = { 
      ...site,
      flag: isBig ? 1 : 0,
      rows: siteX+areaX,
      areaCode: area.areaCode,
      key: `${area.areaCode}_${siteX+areaX}_${areaY+siteY}_selected`,
      columns: areaY+siteY,
      _floor: site.floor+1,
      _rows: site.rows,
      _columns: site.columns,
      _columnName: site.columnName
    }
    const _selected = [...selected,selectedSite];
    if(_selected.length <= max) {
      return (onSelected && onSelected(_selected));
    }
  }, [selected])
  return (
    <>
      {
        areas?.map(area=>{
          const key=`${area.rows}_${area.columns}`;
          const x=(area.columns-1) * siteWidth;
          const y=(area.rows-1) * siteHeight;
          return (
            <G x={x} y={y} key={key}>
              <Axis x={siteWidth-1} y={0} areaName={area.areaCode} axisCount={area.maxColumn}/>
              <Axis x={-siteWidth} y={siteHeight} type='y' axisCount={area.maxRow}/>
              <SiteList sites={area.locationList} area={area} onSelectSite={handleSelectSite}/>
            </G>
          )
        })
      }
    </>
  )
}

export default Area