export default function(){
  return {
    baseStats: {
      physPower: '+20%',
      speed: -50,
      hpMax: '+200%'
    },
    items: [
      {
        name: 'Enrage',
        effect: {
          conditions: {
            hpPctBelow: 0.5
          },
          stats: {
            speed: 100,
            physPower: '20%'
          }
        }
      },
      {
        name: 'Bite',
        effect: {
          abilities: [{
            trigger: { active: true },
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