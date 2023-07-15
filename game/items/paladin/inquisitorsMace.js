import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const duration = 1000 + level * 1000
  return {
    displayName: 'Inquisitor\'s Mace',
    orbs: 2 + level * 5,
    effect: {
      stats: {
        hpMax: wrappedPct(level * 10),
        physPower: wrappedPct(level * 50)
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
                stunned: {
                  duration
                }
              },
              diminishingReturns: true,
            }
          }
        }]
      }]
    }
  }
}