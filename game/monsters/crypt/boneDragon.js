export default function(){
  return {
    baseStats: {
      physPower: '+80%',
      speed: -40,
      hpMax: '+100%'
    },
    items: [
      {
        name: 'Necrotic Breath',
        effect: {
          abilities: [{
            trigger: 'active',
            cooldown: 30000,
            initialCooldown: 10000,
            actions: [{
              attack: {
                scaling: {
                  magicPower: 3
                },
                damageType: 'magic'
              }
            },{
              applyStatusEffect: {
                targets: 'enemy',
                statusEffect: {
                  stacking: 'stack',
                  polarity: 'debuff',
                  stats: {
                    damageDealt: '-30%',
                  },
                  name: 'Aged'
                }
              }
            }]
          }]
        }
      }
    ]
  }
}