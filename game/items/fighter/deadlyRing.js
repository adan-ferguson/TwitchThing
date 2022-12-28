import { critChanceStat, critDamageStat } from '../../stats/combined.js'

export default {
  levelFn: level => ({
    stats: {
      [critDamageStat.name]: `+${20 + 10 * level}%`,
      [critChanceStat.name]: Math.max(0.2 + level * 0.1, 1),
    }
  }),
  orbs: 7
}