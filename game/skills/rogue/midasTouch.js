import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        goldFind: wrappedPct(100 * level),
      },
      mods: [{
        goldOnly: true
      }]
    }
  }
}