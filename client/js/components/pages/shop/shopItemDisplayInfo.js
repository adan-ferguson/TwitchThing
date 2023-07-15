import classDisplayInfo from '../../../displayInfo/classDisplayInfo.js'
import chestImage from '../../chestImage.js'
import { ICON_SVGS } from '../../../assetLoader.js'
import { xpIcon } from '../../common.js'

export function shopItemDisplayInfo(shopItemDef){


  let description
  let imageHtml
  let name
  let color = null
  if(shopItemDef.type === 'adventurerSlot'){
    name = 'Adventurer Slot'
    description = 'Unlock a new adventurer slot.'
    imageHtml = ICON_SVGS.adventurerSlot
  }else if(shopItemDef.type === 'chest'){
    const className = shopItemDef.data?.className
    const classInfo = classDisplayInfo(className)
    name = `Lvl. ${shopItemDef.data.level} ${classInfo.displayName} Chest`
    description = `Contains about ${shopItemDef.data.level} scrap worth of items.`
    imageHtml = chestImage(className)
    color = classInfo.color
  }else if(shopItemDef.type === 'scrap'){
    name = 'Scrap'
    imageHtml = '<i class="fa-solid fa-recycle"></i>'
    description = 'Better value than chests if you just want scrap.'
  }else if(shopItemDef.type === 'stashedXp'){
    name = 'Stashed XP'
    imageHtml = xpIcon()
    description = 'Buy XP to give to an adventurer. Value increases with each purchase. (50, 100, 150, and so on)'
    color = 'green'
  }

  return {
    name,
    imageHtml,
    description,
    color
  }
}