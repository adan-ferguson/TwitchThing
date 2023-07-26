export default function(){
  return {
    baseStats: {
      physPower: '+90%',
      speed: -20,
      hpMax: '+250%'
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
                  persisting: false,
                  stats: {
                    physPower: '0.7x',
                    magicPower: '0.7x',
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