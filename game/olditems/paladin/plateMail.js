import { exponentialPercentage, leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    return {
      stats: {
        hpMax: leveledPctString(40, 10, level),
        physDef: exponentialPercentage(0.1, level - 1, 0.4),
        speed: -40 - level * 10
      }
    }
  },
  orbs: 5,
  rarity: 1
}