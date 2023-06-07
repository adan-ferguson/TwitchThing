export default function(){
  return {
    baseStats: {
      physPower: '+30%',
      speed: -50,
      hpMax: '+200%'
    },
    items: [
      {
        name: 'Enrage',
        effect: {
          metaEffects: [{
            subjectKey: 'self',
            conditions: {
              owner: {
                hpPctBelow: 0.5
              }
            },
            effectModification: {
              stats: {
                speed: 100,
                physPower: '+20%'
              }
            }
          }]
        }
      },
      {
        name: 'Bite',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 11000,
            actions: [{
              attack: {
                scaling: {
                  physPower: 1.4
                },
                lifesteal: 0.5
              }
            }]
          }]
        }
      }
    ]
  }
}