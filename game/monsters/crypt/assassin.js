export default function(tier){
  return {
    baseStats: {
      hpMax: '-25%',
      physPower: '-10%',
      speed: 20 + tier * 40,
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
                count: tier ? 2 : 1,
              }
            }]
          }]
        }
      }
    ]
  }
}