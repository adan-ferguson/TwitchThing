export default function(){
  return {
    baseStats: {
      hpMax: '-20%',
      physPower: '-10%',
      speed: 30
    },
    items: [
      {
        name: 'Cannon Shot',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 6000,
            exclusiveStats: {
              critDamage: '+200%',
              critChance: 1 / 3
            },
            actions: [{
              attack: {
                scaling: {
                  physPower: 1.5
                }
              }
            }]
          }]
        }
      }
    ]
  }
}