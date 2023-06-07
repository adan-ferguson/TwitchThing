export default function(){
  return {
    baseStats: {
      physPower: '+20%',
      physDef: '+30%',
      speed: -10,
      hpMax: '+30%'
    },
    items: [
      {
        name: 'Cursed Strike',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 8000,
            actions: [{
              attack: {
                scaling: {
                  physPower: 1.7
                },
                onHit: {
                  removeStatusEffect: {
                    targets: 'target',
                    polarity: 'buff',
                  }
                }
              }
            }]
          }]
        }
      }
    ]
  }
}