import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  const missChance = exponentialPercentage(0.1, level - 1, 0.20)
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 15000,
        actions: [{
          applyStatusEffect: {
            targets: 'enemy',
            statusEffect: {
              name: 'Sand In Eyes',
              polarity: 'debuff',
              stacking: 'replace',
              stats: {
                missChance
              }
            }
          }
        }]
      }]
    },
    orbs: level * 1 + 1
  }
}