export default function(){
  const chance = 0.2
  return {
    baseStats: {
      hpMax: '+20%',
      physPower: '-20%',
      speed: 20
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