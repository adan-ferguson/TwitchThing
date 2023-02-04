import classDisplayInfo from '../../../classDisplayInfo.js'
import chestImage from '../../chestImage.js'

export function shopItemDisplayInfo(shopItemDef){

  const classInfo = classDisplayInfo(shopItemDef.data?.className)

  let name
  if(shopItemDef.type === 'adventurerSlot'){
    name = 'Adventurer Slot'
  }else if(shopItemDef.type === 'chest'){
    const classInfo = classDisplayInfo(shopItemDef.data.className)
    name = `Lvl. ${shopItemDef.data.level} ${classInfo.displayName} Chest`
  }

  let description
  if(shopItemDef.type === 'adventurerSlot'){
    description = 'Unlock a new adventurer slot.'
  }else if(shopItemDef.type === 'chest'){
    description = `Contains 5 basic ${classInfo.displayName} items. (Nothing else)`
  }

  return {
    name,
    makeImage: () => {
      if(shopItemDef.type === 'adventurerSlot'){
        return makeImg('/assets/icons/adventurerSlot.svg')
      }else if(shopItemDef.type === 'chest'){
        return chestImage(shopItemDef.data.className)
      }else if(shopItemDef.type === 'scrap'){
        return '<i class="fa-solid fa-recycle"></i>'
      }
    },
    description,
    color: classInfo ? classInfo.color : null
  }
}

function makeImg(src){
  const img = document.createElement('img')
  img.src = src
  return img
}