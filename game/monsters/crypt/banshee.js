export default function(){
  return {
    baseStats: {
      physPower: '-20%',
      hpMax: '-20%'
    },
    items: [
      {
        name: 'Wail',
        effect: {
          abilities: [{
            trigger: 'active',
            uses: 1,
            actions: [{
              targetScaledAttack: {
                damageType: 'magic',
                scaling: {
                  hp: 0.5,
                }
              },
            }]
          }]
        }
      },
      {
        name: 'Incorporeal',
        effect: {
          stats: {
            damageCeiling: 1/3
          }
        }
      }
    ]
  }
}