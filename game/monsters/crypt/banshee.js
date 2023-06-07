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
            abilityId: 'bansheeWail',
            trigger: 'active',
            uses: 1,
            actions: [{
              attack: {
                damageType: 'magic',
                targetScaling: {
                  hp: 0.5
                }
              }
            }]
          }]
        }
      },
      {
        name: 'Incorporeal',
        effect: {
          stats: {
            damageCeiling: 0.5
          }
        }
      }
    ]
  }
}