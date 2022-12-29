import { critChanceStat, critDamageStat } from '../../stats/combined.js'

export default {
  levelFn: level => ({
    stats: {
      [critDamageStat.name]: `+${20 + 10 * level}%`,
      [critChanceStat.name]: Math.min(0.15 + level * 0.05, 1),
    }
  }),
  orbs: 6
}