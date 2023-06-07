export default function(){
  const hpScaling = 2
  return {
    baseStats: {
      speed: -150,
      hpMax: '-50%'
    },
    items: [
      {
        name: 'Explode!',
        effect: {
          abilities: [{
            trigger: 'active',
            abilityId: 'explode',
            actions: [{
              attack: {
                damageType: 'magic',
                scaling: {
                  hp: hpScaling
                }
              }
            },{
              takeDamage: {
                scaling: {
                  hp: 1
                },
                damageType: 'magic',
                ignoreDefense: true
              }
            }],
            vars: {
              hpScaling
            }
          }]
        }
      }
    ]
  }
}

