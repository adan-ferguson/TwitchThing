import { leveledPctString } from '../../growthFunctions.js'

export default {
  levelFn: level => ({
    stats: {
      physPower: leveledPctString(7, 3, level),
    }
  }),
  displayName: 'Short Sword',
  orbs: 1
}