export default function(tier){
  return {
    baseStats: {
      hpMax: '-25%',
      physPower: '-10%',
      speed: 20,
    },
    items: [
      {
        name: 'Ambush',
        effect: {
          mods: [{
            sneakAttack: true
          }]
        }
      },
      {
        name: 'Disarm',
        effect: {
          abilities: [{
            trigger: 'active',
            uses: 1,
            actions: [{
              breakItem: {
                statusEffect: {
                  duration: 10000,
                },
                count: 1 + tier * 2,
              }
            }]
          }]
        }
      }
    ]
  }
}