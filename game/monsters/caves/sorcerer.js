export default function(){
  return {
    baseStats: {
      hpMax: '-10%',
      magicPower: '+110%',
      physPower: '-30%'
    },
    items: [
      {
        name: 'Lightning Bolt',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 4000,
            cooldown: 8000,
            tags: ['spell'],
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