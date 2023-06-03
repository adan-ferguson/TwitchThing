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
            targets: 'target',
            statusEffect: {
              base: {
                damageOverTime: {
                  damage: {
                    scaledNumber: {
                      physPower: 0.14 + 0.21 * level
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
    orbs: 2 + level * 3
  }
}