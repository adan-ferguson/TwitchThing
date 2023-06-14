import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      metaEffects: [{
        subjectKey: 'self',
        conditions: {
          owner: {
            deepestFloor: true
          }
        },
        effectModification: {
          stats: {
            combatXP: wrappedPct(25 + 50 * level)
          }
        }
      }]
    }
  }
}