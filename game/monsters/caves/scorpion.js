export default function(tier){
  return {
    baseStats: {
      hpMax: '+30%',
      speed: -30,
      physPower: '-10%'
    },
    items: [
      {
        name: 'Tail Sting',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 12000,
            actions: [{
              attack: {
                scaling: {
                  physPower: 1
                }
              },
            },{
              applyStatusEffect: {
                targets: 'target',
                statusEffect: {
                  base: {
                    damageOverTime: {
                      damage: {
                        scaledNumber: {
                          physPower: 0.3
                        }
                      }
                    }
                  },
                  name: 'poisoned',
                  duration: tier ? 0 : 15000,
                  persisting: true,
                }
              }
            }]
          }]
        }
      },
    ]
  }
}