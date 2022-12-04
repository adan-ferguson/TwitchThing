import { toDisplayName } from '../../game/utilFunctions.js'
import classDisplayInfo from './classDisplayInfo.js'

const CHESTS = {
  normal: {
    color: '#606060'
  },
  boss: {
    color: '#59c916',
    stars: 1
  }
}

export function getChestDisplayInfo(chest){

  const type = chest.type ?? 'normal'

  if(type === 'shop'){
    return shopChest()
  }

  return {
    displayName: toDisplayName(type),
    icon: '<i class="fa-solid fa-star"></i>',
    ...CHESTS[type]
  }

  function shopChest(){
    const info = classDisplayInfo(chest.class)
    return {
      displayName: info.displayName,
      icon: `<img src="${info.orbIcon}">`,
      color: info.color,
      stars: 1
    }
  }
}