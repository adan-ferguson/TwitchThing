export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: { attackHit: { damageType: 'phys' } },
        conditions: {
          source: 'attached'
        },
        actions: [{
          applyStatusEffect: {
            affects: 'target',
            statusEffect: {
              base: {
                damageOverTime: {
                  damage: {
                    scaledNumber: {
                      physPower: 0.07
                    }
                  }
                }
              },
              name: 'bleeding'
            }
          }
        }]
      }]
    },
    orbs: 2 + level * 3,
    vars: {
      affects: 'attached'
    }
  }
}