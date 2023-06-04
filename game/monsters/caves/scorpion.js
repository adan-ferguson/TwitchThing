export default function(){
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
            phantomEffect: {
              base: {
                attackAppliesStatusEffect: {
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
                  duration: 15000,
                  persisting: true,
                }
              }
            },
            actions: [{
              attack: {
                scaling: {
                  physPower: 1
                }
              }
            }]
          }]
        }
      },
    ]
  }
}