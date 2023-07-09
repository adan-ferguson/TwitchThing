import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  const speed = 30 * level + 20
  return {
    effect: {
      stats: {
        dodgeChance: exponentialPercentage(0.08, level - 1, 0.1)
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
  }
}