import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      metaEffects: [{
        subject: { key: 'self' },
        conditions: {
          owner: {
            deepestFloor: true
          }
        },
        effectModification: {
          stats: {
            combatXP: wrappedPct(20 + 30 * level)
          }
        }
      }]
    }
  }
}