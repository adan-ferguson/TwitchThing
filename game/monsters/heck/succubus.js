export default function(){
  return {
    baseStats: {
      speed: 50,
      hpMax: '+5%',
      physPower: '-10%'
    },
    items: [
      {
        name: 'Charm',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 20000,
            initialCooldown: 3000,
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