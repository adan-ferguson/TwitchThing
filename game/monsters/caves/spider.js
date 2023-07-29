export default function(){
  return {
    baseStats: {
      physPower: '+20%',
      hpMax: '+30%',
      speed: 10
    },
    items: [
      {
        name: 'Web Shot',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 9000,
            actions: [{
              applyStatusEffect: {
                targets: 'enemy',
                statusEffect: {
                  base: {
                    slowed: {
                      speed: -40
                    }
                  },
                  name: 'webbed',
                  persisting: true,
                  duration: 10000
                }
              }
            }]
          }]
        }
      }
    ]
  }
}