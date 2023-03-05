import { leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    return {
      stats: {
        physPower: leveledPctString(50, 10, level),
        hpMax: leveledPctString(25, 5, level),
        lifesteal: 0.10 + 0.02 * level
      }
    }
  },
  rarity: 2,
  displayName: 'Vampiric Blade',
  orbs: 12
}