import { leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      physPower: leveledPctString(40, 10, level),
      hpMax: leveledPctString(40, 10, level),
      speed: -40 - 10 * level
    }
  }),
  orbs: 7,
  rarity: 1,
  displayName: 'Mega Hammer'
}