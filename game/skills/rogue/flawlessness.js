import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      metaEffect: {
        subject: {
          key: 'self'
        },
        conditions: {
          owner: {
            hpPct: 1
          }
        },
        effectModification: {
          stats: {
            combatXP: wrappedPct(200 + 300 * level)
          }
        }
      }
    }
  }
}