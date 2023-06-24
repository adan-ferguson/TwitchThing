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
            combatXP: wrappedPct(200 + 300 * level),
            physPower: wrappedPct(20 + 30 * level),
            magicPower: wrappedPct(20 + 30 * level),
          }
        }
      }]
    },
  }
}