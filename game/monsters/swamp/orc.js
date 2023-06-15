export default function(){
  return {
    baseStats: {
      physPower: '+10%',
      hpMax: '+20',
      speed: 10,
    },
    items: [{
      name: 'Aggression',
      effect: {
        abilities: [{
          trigger: 'startOfCombat',
          actions: [{
            applyStatusEffect: {
              targets: 'self',
              statusEffect: {
                duration: 10000,
                name: 'Aggressive',
                polarity: 'buff',
                stats: {
                  speed: 50,
                  physPower: '+50%'
                }
              }
            }
          }]
        }]
      }
    }]
  }
}