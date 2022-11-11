import { geometricProgession } from '../../exponentialValue.js'
import { critChanceStat, critDamageStat, physPowerStat } from '../../stats/combined.js'

export default {
  levelFn: level => ({
    stats: {
      [physPowerStat.name]: Math.round(geometricProgession(0.3, level, 200)),
      [critChanceStat.name]: 15 + level * 5 + '%',
      [critDamageStat.name]: Math.round(geometricProgession(0.2, level, 20)) / 100
    }
  }),
  orbs: 8
}