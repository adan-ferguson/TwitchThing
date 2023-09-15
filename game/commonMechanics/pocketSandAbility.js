import { exponentialPercentage } from '../growthFunctions.js'
export function pocketSandAbility(level){
  const missChance = exponentialPercentage(0.1, level - 1, 0.20)
  return {
    trigger: 'active',
    cooldown: 15000,
    actions: [{
      applyStatusEffect: {
        targets: 'enemy',
        statusEffect: {
          name: 'Sand In Eyes',
          polarity: 'debuff',
          stacking: 'stack',
          stats: {
            missChance
          }
        }
      }
    }]
  }
}