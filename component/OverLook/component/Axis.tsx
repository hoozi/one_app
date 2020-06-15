import React, { useContext, Fragment } from 'react';
import { OverLookContext } from '../index';
import { G, Rect, Text } from 'react-native-svg';

interface IProps {
  x?: number;
  y?: number;
  axisCount?:number,
  type?:string,
  areaName?:string
}

const Axis:React.FC<IProps> = props => {
  const { x, y, axisCount, areaName='', type='x' } = props;
  const { siteWidth, siteHeight, axisColor } = useContext(OverLookContext);
  return (
    <G x={x} y={y}>
      {
        type === 'x' &&
        <>
          <Rect 
            width={siteWidth-1} 
            height={siteHeight-1} 
            x={-siteWidth} 
            y={0} 
            strokeWidth={1} 
            fill={axisColor}
          />
          <Text 
            x={-siteWidth/2} 
            y={siteHeight/2+4}
            fontWeight="bold"
            textAnchor='middle'
            fontSize="12"
            fill="#fff"
          >
            {areaName+''}
          </Text>
        </>
      }
      {
        new Array(axisCount).fill(0).map((axis, index) =>{
          const axisName = type === 'x' ? ((index)*2+1) : (index+1);
          return (
              <Fragment key={`${areaName}_${type}_${axisName}`}>
                <Rect 
                  width={siteWidth-1} 
                  height={siteHeight-1} 
                  x={type === 'x' ? index*siteWidth : siteWidth-1} 
                  y={type === 'x' ? 0 :siteHeight*index}
                  strokeWidth={1} 
                  fill={axisColor}
                />
                <Text 
                  x={type === 'x' ? (index*siteWidth+siteWidth/2) : (siteWidth+siteWidth/2)} 
                  y={type === 'x' ? siteHeight/2+4 : siteHeight*index+(siteHeight/2+4)} 
                  key={`${areaName}_${type}_${axisName}_t`} 
                  fontWeight="bold" 
                  textAnchor='middle' 
                  fill="#fff" fontSize='12'>{axisName+''}</Text>
              </Fragment>
            )
        })
      }
    </G>
  )
}

export default Axis;