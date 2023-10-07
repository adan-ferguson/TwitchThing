import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(-10 + 30 * level),
      },
      abilities: [{
        trigger: 'attackHit',
        conditions: {
          source: {
            key: 'attached'
          },
          data: {
            damageType: 'phys'
          }
        },
        actions: [{
          applyStatusEffect: {
            targets: 'target',
            statusEffect: {
              base: {
                damageOverTime: {
                  damage: {
                    scaledNumber: {
                      physPower: 0.15 + 0.15 * level
                    }
                  }
                }
              },
              name: 'bleeding',
              persisting: false
            }
          }
        }]
      }]
    },
    orbs: 1 + level * 3
  }
}