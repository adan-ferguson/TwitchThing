import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default {
  levelFn: function(level){
    return {
      effect: {
        stats: {
          physPower: wrappedPct(20 + geometricProgression(0.2, level, 40, 5)),
          speed: -20 - 20 * level
        }
      },
    }
  },
  orbs: [4, 3, '...']
}