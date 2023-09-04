export default function(){
  return {
    baseStats: {
      hpMax: '+30%',
      speed: 30,
    },
    items: [{
      name: 'Gallop',
      effect: {
        abilities: [{
          trigger: 'startOfCombat',
          actions: [{
            applyStatusEffect: {
              targets: 'self',
              statusEffect: {
                duration: 5000,
                name: 'Sprinting',
                polarity: 'buff',
                stats: {
                  speed: 120
                }
              }
            }
          }]
        }]
      }
    },{
      name: 'Ride Down',
      effect: {
        abilities: [{
          trigger: 'active',
          cooldown: 10000,
          actions: [{
            attack: {
              scaling: {
                physPower: 1.5
              }
            }
          }]
        }]
      }
    }]
  }
}