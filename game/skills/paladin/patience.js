import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const val = 10 + 10 * level
  return {
    effect: {
      abilities: [{
        trigger: 'instant',
        initialCooldown: 10000,
        resetAfterCombat: true,
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'Being Patient',
              polarity: 'buff',
              stacking: 'stack',
              statusEffectId: 'patience',
              stats: {
                combatXP: wrappedPct(val * 2.5),
                physPower: wrappedPct(val),
                magicPower: wrappedPct(val),
              }
            }
          }
        }]
      }]
    },
  }
}