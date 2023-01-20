import { exponentialPercentage, leveledPercentageString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    return {
      stats: {
        hpMax: leveledPercentageString(30, 20, level),
        physDef: exponentialPercentage(0.1, level - 1, 0.3),
        speed: -40 - level * 10
      }
    }
  },
  orbs: 5
}