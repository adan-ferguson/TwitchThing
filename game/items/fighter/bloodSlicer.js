import physScaling from '../../mods/generic/physScaling.js'
import { critChanceStat } from '../../stats/combined.js'
import { leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    const pct = 0.3
    return {
      stats: {
        [critChanceStat.name]: 0.22 + level * 0.03,
        critLifesteal: pct,
        hpMax: leveledPercentageString(20, 10, level)
      },
      mods: [physScaling]
    }
  },
  orbs: 10
}