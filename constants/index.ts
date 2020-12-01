export interface IHeaderOptions {
  headerStyle:{},
  headerTitleStyle: {},
  headerTintColor: string,
  headerTitleAlign: string
}
export type HeaderOptions = Partial<IHeaderOptions>;

export enum color {
  brand_color = '#2d75ff',
  brand_color_tap = '#2a6ce8',
  tint_color = '#fff',
  text_base_color = '#333B5A',
  fill_color= '#f7f8fa'
}

export const headerOptions:HeaderOptions = {
  headerStyle: {
    backgroundColor: color.brand_color,
    
  },
  headerTintColor: color.tint_color,
  headerTitleAlign: 'center'
}

export const theme = {
  color_text_base: color.text_base_color,

  brand_primary: color.brand_color,
  brand_primary_tap: color.brand_color_tap,

  primary_button_fill: color.brand_color,
  primary_button_fill_tap: color.brand_color_tap,

  segmented_control_color: color.brand_color,  // 同时应用于背景、文字颜色、边框色
}

export const service_url = 'http://120.55.88.128:1010';

export interface IMoveListStatusMap<T> {
  [key: string] : T
}

export const moveListStatusMap:IMoveListStatusMap<string> = {
  'T': '提箱',
  'I': '进箱',
  'M': '移箱',
  'SHIPMENT': '装船',
  'UNLOADSHIP': '卸船'
}

export const moveListUpdateType:IMoveListStatusMap<string> = {
  'T': 'yard',
  'I': 'yard',
  'M': 'yard',
  'SHIPMENT': 'wharf',
  'UNLOADSHIP': 'wharf'
}
