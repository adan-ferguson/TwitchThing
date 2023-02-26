import { exponentialPercentage } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      dodgeChance: exponentialPercentage(0.03, level - 1, 0.1),
      speed: 25 + level * 5
    }
  }),
  orbs: 4
}