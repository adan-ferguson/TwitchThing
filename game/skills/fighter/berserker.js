import { wrappedPct } from '../../growthFunctions.js'

export default {
  levelFn(level){
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
                isBuff: true,
                stacking: 'stack',
                stats: {
                  physPower: wrappedPct(4 + level * 8)
                }
              }
            }
          }]
        }]
      }
    }
  }
}