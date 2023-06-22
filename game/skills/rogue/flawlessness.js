import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      metaEffects: [{
        subject: {
          key: 'self'
        },
        conditions: {
          owner: {
            hpFull: true
          }
        },
        effectModification: {
          stats: {
            combatXP: wrappedPct(200 + 300 * level)
          }
        }
      }]
    }
  }
}