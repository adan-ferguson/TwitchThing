export default function(level){
  const speed = -level * 10 - 20
  return {
    effect: {
      stats: {
        critChance: 0.08 + level * 0.02
      },
      abilities: [{
        trigger: 'crit',
        actions: [{
          applyStatusEffect: {
            targets: 'target',
            statusEffect: {
              name: 'cripplingPoison',
              base: {
                damageOverTime: {
                  damage: {
                    scaledNumber: {
                      physPower: 0.2 + 0.1 * level
                    }
                  }
                }
              },
              stats: {
                speed
              }
            }
          }
        }]
      }]
    },
    orbs: level * 2 + 3
  }
}