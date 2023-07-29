export default function(){
  return {
    baseStats: {
      hpMax: '+5%',
      magicPower: '+120%',
      physPower: '-30%',
      speed: 25,
    },
    items: [
      {
        name: 'Lightning Bolt',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 4000,
            cooldown: 8000,
            actions: [{
              attack: {
                scaling: {
                  magicPower: 2
                },
                damageType: 'magic',
                range: [0, 1]
              }
            }]
          }]
        }
      }
    ]
  }
}