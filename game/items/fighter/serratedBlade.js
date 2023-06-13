import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  return {
    effect: {
      stats: {
        physPower: wrappedPct(20 * level),
      },
      abilities: [{
        trigger: 'attackHit',
        conditions: {
          source: {
            subjectKey: 'attached'
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
                      physPower: 0.15 + 0.10 * level
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
    orbs: 2 + level * 4
  }
}