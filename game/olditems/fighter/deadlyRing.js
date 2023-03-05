import { leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      physPower: leveledPctString(60, 20, level),
      hpMax: leveledPctString(60, 20, level),
      speed: -40 - 10 * level
    }
  }),
  orbs: 8,
  rarity: 1,
  displayName: 'Mega Hammer'
}