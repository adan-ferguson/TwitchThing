import { arrayize, toDisplayName } from '../../../game/utilFunctions.js'
import classDisplayInfo from './classDisplayInfo.js'

const CHESTS = {
  normal: {
    color: '#aba9a9'
  },
  boss: {
    color: '#59c916',
    stars: 1
  },
  zoneReward: {
    color: '#4696a4',
    stars: 2
  },
  bounty: {
    color: '#dabd74'
  }
}

export function getChestDisplayInfo(chests){

  chests = arrayize(chests)

  const multi = chests.length > 1
  const main = chests[0]

  let type = main.options.type ?? 'normal'

  if(type === 'shop'){
    return shopChest()
  }

  if(!CHESTS[type]){
    type = 'normal'
  }

  return {
    displayName: toChestName(type),
    icon: '<i class="fa-solid fa-star"></i>',
    multi,
    ...CHESTS[type]
  }

  function shopChest(){
    const info = classDisplayInfo(main.options.classes[0])
    return {
      displayName: toChestName(main.options.classes[0]),
      icon: info.icon,
      color: info.color,
      stars: 1
    }
  }

  function toChestName(type){
    let text = ''
    if(main.options.level){
      text += `Lvl. ${main.options.level} `
    }
    text += `${toDisplayName(type)} Chest`
    if(multi){
      text += ` x${chests.length}`
    }
    return text
  }
}