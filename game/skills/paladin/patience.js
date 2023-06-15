import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      metaEffects: [{
        subject: { key: 'self' },
        conditions: {
          owner: {
            overtime: true
          }
        },
        effectModification: {
          stats: {
            combatXP: wrappedPct(100 + 200 * level),
            physPower: wrappedPct(25 + 25 * level),
            magicPower: wrappedPct(25 + 25 * level),
          }
        }
      }]
    },
  }
}