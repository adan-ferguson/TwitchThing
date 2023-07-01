export default function(){
  return {
    baseStats: {
      physPower: '-20%',
      hpMax: '-10%',
      speed: 30,
    },
    items: [{
      name: 'Raging',
      effect: {
        abilities: [{
          trigger: 'startOfCombat',
          actions: [{
            applyStatusEffect: {
              targets: 'self',
              statusEffect: {
                name: 'No Die!',
                mods: [{
                  cantDie: true,
                }],
                duration: 15000,
                polarity: 'buff',
              }
            }
          }]
        }]
      }
    }]
  }
}