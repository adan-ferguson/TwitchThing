import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: {
          attackHit: true
        },
        actions: [{
          applyStatusEffect: {
            affects: 'self',
            statusEffect: {
              name: 'berserk',
              polarity: 'buff',
              stacking: 'stack',
              maxStacks: 4 + level,
              stats: {
                physPower: wrappedPct(10 + level * 10)
              }
            }
          }
        }]
      }]
    }
  }
}