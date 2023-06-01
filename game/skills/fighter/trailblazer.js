import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      metaEffects: [{
        subjectKey: 'self',
        conditions: {
          deepestFloor: true
        },
        effectModification: {
          stats: {
            combatXP: wrappedPct(50 * level)
          }
        }
      }]
    }
  }
}