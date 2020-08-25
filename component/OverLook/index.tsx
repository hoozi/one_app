import React, { createContext, useMemo, useCallback } from 'react';
import { Animated, Dimensions } from 'react-native';
import { Svg, Defs, Image, G } from 'react-native-svg';
import { PinchGestureHandler, PanGestureHandler, State } from 'react-native-gesture-handler';
import { color } from '../../constants';
import AreaList from './component/AreaList';
import Empty from '../Empty';
import SelectedList from './component/SelectedList';
import Legend, { IRow } from './component/Legend';

export const OverLookContext:any = createContext({});

interface IOptions {
  siteWidth?: number;
  siteHeight?: number;
  viewWidth?: number;
  viewHeight?: number;
  siteColor?: string;
  axisColor?: string;
}

interface IProps {
  defaultSites?:string[];
  data?: any;
  mapWidth?: number;
  mapHeight?: number;
  visiable?:boolean;
  selected?:any[];
  onSelectedSite?(selected: any[]):void;
  singleSelect?:boolean;
  isBig?:boolean;
  max?:number;
  controlType?:string
  vt?:string
  //minScale?:number;
}

export const floorColors:IRow[] = [
  {
    color: '#fff',
    text: 'null',
  },
  {
    color: '#faad14',
    text: '一层'
  },
  {
    color: '#bae637',
    text: '二层'
  },
  {
    color: '#389e0d',
    text: '三层'
  },
  {
    color: '#40a9ff',
    text: '四层'
  },
  {
    color: '#36cfc9',
    text: '五层'
  },
  {
    color: '#cf1322',
    text: '六层'
  },
  {
    color: '#c41d7f',
    text: '七层'
  }
]
const wh = Dimensions.get('window');
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const OverLookWrap = (options:IOptions={}) => {
  const { 
    siteWidth=90, 
    siteHeight=45, 
    viewWidth=wh.width, 
    viewHeight=wh.height,
    siteColor='#fff',
    axisColor=color.brand_color 
  } = options;
  
  const OverLookComponent:React.FC<IProps> = props => {
    const { 
      mapWidth=0, 
      mapHeight=0, 
      visiable=false,
      max=1, 
      //minScale=0.5,
      controlType,
      vt,
      selected=[], 
      onSelectedSite, 
      data, 
      defaultSites, 
      singleSelect=false,
      isBig = false 
    } = props;
    let { translateX,translateY, lastOffset, baseScale, pinchScale, scale, lastScale, minScale } = useMemo(():any => {
      let minScale = Math.min(viewHeight/mapHeight, viewWidth/mapWidth);
      if(viewHeight >= mapHeight &&  viewWidth >= mapWidth) {
        minScale = 1;
      }
      //console.log(minScale)
      const baseScale = new Animated.Value(1);
      const pinchScale = new Animated.Value(1);
      return {
        translateX:new Animated.Value(0),
        translateY : new Animated.Value(0),
        lastOffset : { x: 0, y: 0 },
        baseScale,
        minScale,
        pinchScale,
        scale : Animated.multiply(baseScale, pinchScale),
        lastScale : 1
      }
    },[]);
    const centerX = Math.round((viewWidth - mapWidth)-(viewWidth - mapWidth * minScale));
    const centerY =  Math.round((viewHeight - mapHeight)-(viewHeight - mapHeight * minScale));
    const handlePanGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: translateX,
            translationY: translateY,
          },
        },
      ],
      { useNativeDriver: true }
    );
    const handlePanStateChange = (event:any) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        lastOffset.x += event.nativeEvent.translationX;
        lastOffset.y += event.nativeEvent.translationY;
        translateX.setOffset(lastOffset.x);
        translateX.setValue(0);
        translateY.setOffset(lastOffset.y);
        translateY.setValue(0);
      }
    }

    const handlePinchGestureEvent = Animated.event(
      [{ nativeEvent: { scale: pinchScale } }],
      { useNativeDriver: true }
    );
    const handlePinchStateChange = (event:any) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        lastScale *= event.nativeEvent.scale;
        if(lastScale >=1 ) {
          lastScale = 1;
        } else if(lastScale <= minScale)  {
          lastScale = minScale
        }
        baseScale.setValue(lastScale);
        pinchScale.setValue(1);
      }
    };

    const handleSelected = useCallback((_selected,type='append') => {
      onSelectedSite && onSelectedSite(type === 'append' ? _selected : [...selected.filter(item => item.id !== _selected.id)]);
    }, [selected]);

    const overLookContext = useMemo(() => ({
      siteWidth,
      siteHeight,
      siteColor,
      defaultSites,
      singleSelect,
      selected,
      isBig,
      max,
      axisColor, 
      controlType,
      vt
    }), [
      siteWidth,
      siteHeight,
      siteColor,
      isBig,
      max,
      defaultSites,
      singleSelect,
      selected,
      axisColor,
      controlType,
      vt
    ]);
    return (
      data && visiable ? 
      <OverLookContext.Provider value={overLookContext}>
        <PanGestureHandler
          onGestureEvent={handlePanGestureEvent}
          onHandlerStateChange={handlePanStateChange}
          minPointers={1}
          maxPointers={1}
        >
          <Animated.View>
            <PinchGestureHandler
              onGestureEvent={handlePinchGestureEvent}
              onHandlerStateChange={handlePinchStateChange}
            >
              <AnimatedSvg
                style={{
                  backgroundColor: 'transparent',
                  //marginLeft: centerX * minScale,
                  //marginTop: centerY * minScale,
                  width: mapWidth,
                  height: mapHeight,
                    transform: [
                      { scale },
                      { translateX },
                      { translateY }
                    ]
                }}
              >
                <AreaList areas={data} onSelected={selected => handleSelected(selected)}/>
                <SelectedList onDelete={(selected:any) => handleSelected(selected, 'delete')}/> 
              </AnimatedSvg>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
        <Legend data={[
          {
            type: 'image',
            text: '已选'
          },
          ...floorColors.slice(1)
        ]}/>
      </OverLookContext.Provider> : <Empty/>
    )
  }
  return OverLookComponent;
}

export default OverLookWrap;