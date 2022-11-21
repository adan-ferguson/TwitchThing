import { toDisplayName } from '../../game/utilFunctions.js'

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
  return {
    displayName: toDisplayName(type),
    ...CHESTS[type]
  }
}