import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(10 + 10 * level),
      }
    },
    displayName: 'Short Sword',
    orbs: level * 1
  }
}