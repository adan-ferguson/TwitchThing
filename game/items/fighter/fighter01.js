import { wrappedPct } from '../../growthFunctions.js'

export default {
  levelFn: function(level){
    return {
      effect: {
        stats: {
          physPower: wrappedPct(10 * level),
        }
      },
      orbs: level,
      displayName: 'Short Sword'
    }
  }
}