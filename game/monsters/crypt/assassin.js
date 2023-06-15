export default function(){
  return {
    baseStats: {
      hpMax: '-10%',
      physPower: '+10%',
      speed: +35
    },
    items: [
      {
        name: 'Dagger',
        effect: {
          stats: {
            speed: 40
          }
        }
      },
      {
        name: 'Disarm',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 15000,
            actions: [{
              breakItem: {
                statusEffect: {
                  duration: 15000,
                  persisting: false
                }
              }
            }]
          }]
        }
      }
    ]
  }
}