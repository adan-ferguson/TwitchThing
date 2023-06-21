import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(5 + 15 * level),
      }
    },
    displayName: 'Short Sword',
    orbs: level * 1
  }
}