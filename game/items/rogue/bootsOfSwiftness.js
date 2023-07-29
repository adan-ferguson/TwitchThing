import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  const speed = 10 + level * 30
  return {
    effect: {
      stats: {
        dodgeChance: exponentialPercentage(0.05, level - 1, 0.1)
      },
      abilities: [{
        trigger: 'thwart',
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect:{
              polarity: 'buff',
              name: 'Swift',
              duration: 5000,
              stacking: 'stack',
              stats: {
                speed
              }
            }
          }
        }]
      }]
    },
    orbs: level * 3 + 3,
  }
}