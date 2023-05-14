export default {
  baseStats: {
    hpMax: '+30%',
    speed: -30,
    physPower: '-10%'
  },
  items: [
    {
      name: 'Tail Sting',
      effect: {
        abilities: [{
          trigger: { active: true },
          cooldown: 12000,
          actions: [{
            attack: {
              scaling: {
                physPower: 1
              }
            },
            applyStatusEffect: {
              affects: 'target',
              statusEffect: {
                base: 'damageOverTime',
                name: 'poisoned',
                duration: 10000,
                persisting: true,
                Xparams: {
                  Xdamage: {
                    physPower: 0.1
                  }
                }
              }
            }
          }]
        }]
      }
    },
  ]
}