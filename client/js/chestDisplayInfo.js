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

  let type = chest.type ?? 'normal'

  if(type === 'shop'){
    return shopChest()
  }

  if(!CHESTS[type]){
    type = 'normal'
  }

  return {
    displayName: toDisplayName(type),
    icon: '<i class="fa-solid fa-star"></i>',
    ...CHESTS[type]
  }

  function shopChest(){
    const info = classDisplayInfo(chest.classes[0])
    return {
      displayName: info.displayName,
      icon: info.icon,
      color: info.color,
      stars: 1
    }
  }
}