import { blockChanceStat, magicPowerStat } from '../../stats/combined.js'
import attackAction from '../../actions/attackAction.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      [blockChanceStat.name]: 0.3,
      [magicPowerStat.name]: leveledPercentageString(10, 10, level)
    },
    abilities: {
      block: {
        actions: [
          attackAction({
            damageTyppe: 'magic',
            damageMulti: 0.7 + 0.1 * level
          })
        ]
      }
    }
  }),
  orbs: 6
}