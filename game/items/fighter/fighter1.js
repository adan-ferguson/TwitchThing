import { wrappedPct } from '../../growthFunctions.js'

export default {
  levelFn: level => {
    return {
      effect: {
        stats: {
          physPower: wrappedPct(10 * level),
        }
      },
      orbs: level => level
    }
  },
  displayName: 'Short Sword'
}