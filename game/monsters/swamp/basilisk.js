export default function(){
  const chance = 0.1
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
                  attack: {
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