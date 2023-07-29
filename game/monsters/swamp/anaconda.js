export default function(){
  return {
    baseStats: {
      hpMax: '+40%',
      speed: -30,
      physPower: '+60%'
    },
    items: [
      {
        name: 'Constrict',
        effect: {
          abilities: [{
            trigger: 'active',
            uses: 1,
            abilityId: 'constrict',
            actions: [{
              applyStatusEffect: {
                targets: 'enemy',
                statusEffect: {
                  polarity: 'debuff',
                  name: 'constricted',
                  stats: {
                    speed: -10
                  },
                  stacking: 'stack',
                  abilities: [{
                    trigger: 'instant',
                    initialCooldown: 3000,
                    actions: [{
                      modifyStatusEffect: {
                        targets: 'self',
                        subject: {
                          key: 'self'
                        },
                        modification: {
                          stacks: 1
                        }
                      }
                    }]
                  }]
                }
              }
            }]
          }]
        }
      }
    ]
  }
}