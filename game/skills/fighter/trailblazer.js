import { wrappedPct } from '../../growthFunctions.js'

export default {
  levelFn(level){
    return {
      effect: {
        conditions: {
          deepestFloor: true
        },
        stats: {
          combatXP: wrappedPct(50 * level),
        }
      }
    }
  }
}