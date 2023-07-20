export default function(){
  return {
    baseStats: {
      speed: 20,
      hpMax: '-10%',
      physPower: '-20%'
    },
    items: [
      {
        name: 'Charm',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 30000,
            initialCooldown: 6000,
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
        name: 'Drain You',
        effect: {
          stats: {
            lifesteal: 0.33
          }
        }
      }
    ]
  }
}