import { geometricProgession } from '../../exponentialValue.js'
import { critChanceStat, physPowerStat } from '../../stats/combined.js'

export default {
  levelFn: level => ({
    stats: {
      [physPowerStat.name]: Math.round(geometricProgession(0.3, level, 100)),
      [critChanceStat.name]: 20 + level * 10 + '%',
    }
  }),
  orbs: 8
}