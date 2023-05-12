import { wrappedPct } from '../../growthFunctions.js'

export default {
  levelFn(level){
    return {
      effect: {
        stats: {
          physPower: wrappedPct(15 + 15 * level),
          hpMax: wrappedPct(15 + 15 * level)
        }
      }
    }
  },
}