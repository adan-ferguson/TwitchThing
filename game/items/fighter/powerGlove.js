import { exponentialPercentage } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      physDef: exponentialPercentage(0.05, level - 1, 0.1),
      speed: 18 + level * 2
    }
  }),
  displayName: 'Lightweight Armor',
  orbs: 3
}