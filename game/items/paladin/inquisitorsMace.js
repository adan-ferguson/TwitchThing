import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const pct = wrappedPct(level * 20)
  const duration = 1000 + level * 1000
  return {
    orbs: 2 + level * 5,
    effect: {
      stats: {
        hpMax: pct,
        physPower: pct
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
            }
          }
        }]
      }]
    }
  }
}