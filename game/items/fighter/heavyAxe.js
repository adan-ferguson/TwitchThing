import { wrappedPct } from '../../growthFunctions.js'

export default {
  levelFn: function(level){
    return {
      effect: {
        stats: {
          physPower: wrappedPct( 20 + 40 * level),
          speed: -20 - 20 * level
        }
      },
    }
  },
  orbs: [4, 3, '...']
}