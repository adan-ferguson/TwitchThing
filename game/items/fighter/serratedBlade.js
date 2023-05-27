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
            target: 'target',
            statusEffect: {
              base: {
                damageOverTime: {
                  damage: {
                    scaledNumber: {
                      physPower: 0.35
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
    orbs: 2 + level * 3,
    vars: {
      target: 'attached'
    }
  }
}