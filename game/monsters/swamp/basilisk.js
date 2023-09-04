export default function(){
  const chance = 0.2
  return {
    baseStats: {
      hpMax: '+10%',
      physPower: '-30%',
      speed: 10
    },
    items: [
      {
        name: 'Deadly Gaze',
        effect: {
          abilities: [{
            vars: {
              chance,
            },
            abilityId: 'deadlyGaze',
            trigger: 'active',
            initialCooldown: 7000,
            actions: [{
              maybe: {
                chance,
                action: {
                  targetScaledAttack: {
                    damageType: 'magic',
                    scaling: {
                      hpMax: 1
                    }
                  }
                }
              }
            }]
          }]
        }
      }
    ]
  }
}