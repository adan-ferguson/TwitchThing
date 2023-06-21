import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  const missChance = exponentialPercentage(0.1, level - 1, 0.25)
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 15000,
        actions: [{
          applyStatusEffect: {
            targets: 'enemy',
            statusEffect: {
              polarity: 'debuff',
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