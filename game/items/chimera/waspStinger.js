export default function(level){
  const chance = 0.25
  const physPower = 0.1 + 0.3 * level
  return {
    effect: {
      abilities: [{
        trigger: 'attackHit',
        conditions: {
          random: chance
        },
        actions: [{
          applyStatusEffect: {
            targets: 'target',
            statusEffect: {
              base: {
                damageOverTime: {
                  damage: {
                    scaledNumber: {
                      physPower
                    }
                  }
                }
              },
              name: 'poisoned'
            }
          }
        }]
      }]
    },
    orbs: level * 2 + 1
  }
}