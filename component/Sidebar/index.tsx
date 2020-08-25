import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { color } from '../../constants';

interface ISideItem {
  title?: string | React.ReactElement | Function;
  value?: any;
  extra?: string
}

interface IColorMap {
  dark: any,
  light: any,
  [key: string]:any
}

type theme_type = keyof IColorMap

interface IProps {
  selected?: number;
  theme?: theme_type;
  onSelectedChange?(selected:number, item:any):void;
  sideItems:ISideItem[];
}


const Sidebar:React.FC<IProps> = props => {
  const themeColorMap:IColorMap = {
    'dark': {
      barColor: styles.sideDark,
      itemColor: styles.sideDarkItem,
      active: styles.sideDarkItemActive
    },
    'light':{
      barColor: styles.sideLight,
      itemColor: styles.sideLigthItem,
      active: styles.sideLightItemAction
    }
  }
  const { theme = 'dark', selected = 0, onSelectedChange, sideItems=[] } = props;
  const [ sideSelected, setSelected ] = useState<number>(selected);
  const handleSideItemChange = useCallback((selected:number, item:any) => {
    
      setSelected(selected);
      onSelectedChange && onSelectedChange(selected, item);
    
  }, []);
  return (
    <View style={[styles.sideContainer, themeColorMap[theme].barColor]}>
        {
          sideItems.map((item, index) => {
            const { title, value } = item
            return (
              <TouchableOpacity key={index} onPress={() => handleSideItemChange(index, item)} activeOpacity={1}>
                <Text style={[styles.sideItem, themeColorMap[theme].itemColor , sideSelected === index && themeColorMap[theme].active ]}>
                  {typeof title === 'function' ? title(sideSelected === index ? 'active' : 'unactive') : title}
                </Text>
              </TouchableOpacity>
            )
          })
        }
    </View>
  )
}

const styles = StyleSheet.create({
  sideContainer: {
    width: 85,
    height: '100%',
    overflow: 'hidden',
    paddingTop: 16,
  },
  sideDark: {
    backgroundColor: color.brand_color,
  },
  sideLight: {
    backgroundColor: '#fff',
  },
  sideItem: {
    width: '100%', 
    marginLeft: 16,
    backgroundColor: color.brand_color, 
    paddingVertical: 12, 
    fontSize: 16,
    paddingLeft:8, 
    borderTopLeftRadius: 4, 
    borderBottomLeftRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sideLigthItem: {
    backgroundColor: '#fff',
    color: color.text_base_color
  },
  sideDarkItem: {
    color: '#fff'
  },
  sideDarkItemActive: {
    backgroundColor: '#fff',
    color: color.text_base_color
  },
  sideLightItemAction: {
    backgroundColor: color.brand_color,
    color: '#fff', 
  }
})

export default Sidebar;