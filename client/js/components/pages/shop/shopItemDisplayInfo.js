import classDisplayInfo from '../../../displayInfo/classDisplayInfo.js'
import chestImage from '../../chestImage.js'
import { ICON_SVGS } from '../../../assetLoader.js'

export function shopItemDisplayInfo(shopItemDef){

  const className = shopItemDef.data?.className
  const classInfo = classDisplayInfo(className)

  let description
  let imageHtml
  let name
  if(shopItemDef.type === 'adventurerSlot'){
    name = 'Adventurer Slot'
    description = 'Unlock a new adventurer slot.'
    imageHtml = ICON_SVGS.adventurerSlot
  }else if(shopItemDef.type === 'chest'){
    name = `Lvl. ${shopItemDef.data.level} ${classInfo.displayName} Chest`
    description = `Contains about ${shopItemDef.data.level} scrap worth of items.`
    imageHtml = chestImage(className)
  }else if(shopItemDef.type === 'scrap'){
    name = 'Scrap x' + shopItemDef.data.scrap
    imageHtml = '<i class="fa-solid fa-recycle"></i>'
    description = 'Better value than chests if you just want scrap.'
  }

  return {
    name,
    imageHtml,
    description,
    color: classInfo ? classInfo.color : null
  }
}