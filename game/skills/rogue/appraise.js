import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        rareFind: wrappedPct(50 * level),
      }
    }
  }
}