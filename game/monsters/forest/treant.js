export default function(){
  return {
    baseStats: {
      speed: -120,
      hpMax: '+140%',
      physPower: '+60%'
    },
    items: [{
      name: 'Sprout Saplings',
      effect: {
        abilities: [{
          trigger: 'startOfCombat',
          abilityId: 'sproutSaplings',
          uses: 1,
          actions: [{
            applyStatusEffect: {
              targets: 'self',
              statusEffect: {
                name: 'Sapling',
                polarity: 'buff',
                statusEffectId: 'sproutSaplings',
                abilities: [{
                  trigger: 'attacked',
                  uses: 3,
                  abilityId: 'saplingBlock',
                  replacements: {
                    cancel: 'absorbed'
                  }
                }]
              }
            }
          }]
        }]
      }
    }]
  }
}