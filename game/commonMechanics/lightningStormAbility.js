export function lightningStormAbility(magicPower, cooldown = 0, duration = 0){
  return {
    trigger: 'active',
    cooldown,
    abilityId: 'lightningStorm',
    actions: [{
      applyStatusEffect: {
        targets: 'self',
        statusEffect: {
          name: 'lightningStorm',
          polarity: 'buff',
          duration,
          persisting: true,
          abilities: [{
            trigger: 'instant',
            initialCooldown: 3000,
            actions: [{
              attack: {
                damageType: 'magic',
                scaling: {
                  magicPower
                },
                range: [0, 1],
              }
            }]
          }]
        }
      }
    }],
    vars: {
      duration,
      magicPower
    }
  }
}