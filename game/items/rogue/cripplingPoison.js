export default function(level){
  const speed = -level * 10 - 5
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
                      physPower: 0.25 + 0.15 * level
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
    orbs: level * 4 + 2
  }
}