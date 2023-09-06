import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        goldFind: wrappedPct(50 + 50 * level),
      },
      mods: [{
        goldOnly: true
      }]
    }
  }
}