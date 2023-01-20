import { critChanceStat, critDamageStat } from '../../stats/combined.js'

export default {
  levelFn: level => ({
    stats: {
      [critDamageStat.name]: `+${20 + 20 * level}%`,
      [critChanceStat.name]: 0.2,
    }
  }),
  orbs: 7
}