import React, { useContext, Fragment } from 'react';
import { OverLookContext } from '../index';
import { Image } from 'react-native-svg';

const SelectedList:React.FC<any> = props => {
  const { onDelete } = props;
  const { siteWidth, siteHeight, selected } = useContext(OverLookContext);
  const selectedImage = require('./selected.jpg');
  const selectedImage2 = require('./selected2.jpg');
  return (
    <>
      {
        selected.map((site:any) => {
          const x = (site.columns-1)*siteWidth+siteWidth-1;
          const y = (site.rows-1)*siteHeight+siteHeight;
          return (
            <Image
              x={x}
              y={y} 
              key={site.key}
              width={site.flag ? siteWidth*2-1 : siteWidth-1} 
              height={siteHeight-1}
              preserveAspectRatio='xMidyMid slice'
              href={site.flag ? selectedImage2 : selectedImage}
              onPress={() => onDelete && onDelete(site)}
            />  
          )
        })
      }
    </>
  )
}
export default SelectedList