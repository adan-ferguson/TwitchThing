export default function(){
  return {
    baseStats: {
      speed: 10,
      hpMax: '-20%',
      physPower: '-20%'
    },
    items: [
      {
        name: 'Charm',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 30000,
            actions: [{
              applyStatusEffect: {
                targets: 'enemy',
                statusEffect: {
                  base: {
                    charmed: {
                      duration: 10000
                    }
                  }
                }
              }
            }]
          }]
        }
      },
      {
        name: 'Drain Life',
        effect: {
          stats: {
            lifesteal: 0.33
          }
        }
      }
    ]
  }
}