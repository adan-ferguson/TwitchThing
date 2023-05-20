export default {
  baseStats: {
    hpMax: '+300%',
    speed: -30,
    physPower: '-10%'
  },
  items: [
    {
      name: 'Tail Sting',
      effect: {
        abilities: [{
          trigger: { active: true },
          cooldown: 1200,
          phantomEffect: {
            base: {
              attackAppliesStatusEffect: {
                base: {
                  damageOverTime: {
                    damage: {
                      scaledNumber: {
                        physPower: 0.1
                      }
                    }
                  }
                },
                name: 'poisoned',
                duration: 30000,
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