import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      metaEffect: {
        self: {
          conditions: {
            deepestFloor: true
          },
          stats: {
            combatXP: wrappedPct(50 * level)
          }
        }
      }
    }
  }
}