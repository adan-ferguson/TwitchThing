import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        hpMax: wrappedPct(5 + 15 * level),
      }
    },
    orbs: level * 1,
    displayName: 'Bulk'
  }
}