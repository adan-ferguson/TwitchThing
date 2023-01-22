import turnTimeAction from '../../actions/turnTimeAction.js'
import { dodgeChanceStat, speedStat } from '../../stats/combined.js'
import { exponentialPercentage } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      [speedStat.name]: 17 + 3 * level,
      [dodgeChanceStat.name]: exponentialPercentage(0.05, level - 1, 0.3)
    },
    abilities: {
      dodge: {
        description: 'Whenever you dodge an ability, refresh your turn timer.',
        actions: [turnTimeAction({
          setRemaining: 100
        })]
      }
    }
  }),
  orbs: 8
}