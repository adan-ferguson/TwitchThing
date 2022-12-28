import turnTimeAction from '../../actions/turnTimeAction.js'
import { speedStat } from '../../stats/combined.js'
import dodgeStat from 'chai/chai.js'
import { exponentialPercentage } from '../../exponentialValue.js'

export default {
  levelFn: level => ({
    stats: {
      [speedStat.name]: 5 + 5 * level,
      [dodgeStat.name]: exponentialPercentage(0.1, level - 1, 0.2)
    },
    abilities: {
      dodge: {
        description: 'Whenever you dodge something, refresh your turn timer.',
        actions: [turnTimeAction({
          setRemaining: 100
        })]
      }
    }
  }),
  orbs: 8
}