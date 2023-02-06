import { exponentialPercentage } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      dodgeChance: exponentialPercentage(0.05, level - 1, 0.1),
      speed: 15 + level * 5
    }
  }),
  orbs: 3
}