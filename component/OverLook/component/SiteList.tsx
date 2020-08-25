import React, { useContext } from 'react';
import { OverLookContext } from '../index';
import { G, Rect, Text } from 'react-native-svg';
import { floorColors } from '../index';

interface IProps {
  sites: any[];
  onSelectSite?(s:any, a:any):void;
  area: any
}

const SiteList:React.FC<IProps> = props => {
  const { sites, onSelectSite, area } = props;
  const { siteWidth, siteHeight, siteColor, defaultSites } = useContext(OverLookContext);
  return (
  <>
    {
      sites.map(site => {
        const x = (site.columns-1)*siteWidth+siteWidth-1;
        const y = (site.rows-1)*siteHeight+siteHeight;
        const key = `${site.rows}_${site.columns}`;
        const postionName = `${site.rows}列 ${(site.columns-1)*2+1+site.flag}贝`;
        const { ctnNo, ctnOwner, ctnSizeType } = site;
        const ctnExtraInfoText = `${ctnOwner}/${ctnSizeType}`
        const index = `${area.areaCode}/${site.rows}/${site.columnName}`;
        site.floor = site.floor || 0;
       /*  const isCurrentPosition = defaultSites?.some((site:string) => {
          let _site = site;
          return _site.indexOf(index) > -1
        }); */
        return (
          !site._delete && 
          <G
            x={x}
            y={y}
            key={key}
          >
            <Rect
              width={site.flag ? siteWidth*2-1 : siteWidth-1} 
              height={siteHeight-1} 
              fill={/* isCurrentPosition ? '#fafafa' :  */floorColors[!site.floor ? 0 : site.floor].color}
              onPress={() => onSelectSite && onSelectSite(site, area)}
            />
            <Text fill='#000' textAnchor='middle' x={site.flag ? siteWidth :siteWidth/2} y={12}>
              { postionName }
            </Text>
            <Text fill='#000' textAnchor='middle' x={site.flag ? siteWidth :siteWidth/2} y={26}>
              { ctnNo }
            </Text>
            {
              (ctnOwner || ctnSizeType) && 
              <Text fill='#000' textAnchor='middle' x={site.flag ? siteWidth :siteWidth/2} y={39}>
                {ctnExtraInfoText}
              </Text>
            }
            
          </G>
        )
      })
    }
  </>
  )
}
export default SiteList