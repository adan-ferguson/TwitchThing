import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      metaEffects: [{
        subject: 'self',
        conditions: {
          deepestFloor: true
        },
        effect: {
          stats: {
            combatXP: wrappedPct(50 * level)
          }
        }
      }]
    }
  }
}