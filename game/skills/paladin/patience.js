import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const val = 5 + 5 * level
  return {
    effect: {
      abilities: [{
        trigger: 'instant',
        initialCooldown: 10000,
        resetAfterCombat: true,
        action: [{
          applyStatusEffect: {
            name: 'Being Patient',
            polarity: 'buff',
            persisting: false,
            stacking: 'stack',
            stats: {
              combatXP: wrappedPct(val * 10),
              physPower: wrappedPct(val),
              magicPower: wrappedPct(val),
            }
          }
        }]
      }]
    },
  }
}