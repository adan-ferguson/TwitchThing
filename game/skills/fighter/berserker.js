import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'attackHit',
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'berserk',
              polarity: 'buff',
              stacking: 'stack',
              maxStacks: 3 + level * 2,
              stats: {
                physPower: wrappedPct(15 + level * 5)
              }
            }
          }
        }]
      }]
    }
  }
}