import { wrappedPct } from '../../growthFunctions.js'

export default {
  levelFn: function(level){
    return {
      effect: {
        stats: {
          physPower: wrappedPct(10 * level),
        }
      },
      displayName: 'Short Sword'
    }
  },
  orbs: [1, '...']
}