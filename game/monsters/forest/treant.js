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
          trigger: {
            combatTime: 1
          },
          abilityId: 'sproutSaplings',
          uses: 1,
          actions: [{
            applyStatusEffect: {
              targets: 'self',
              statusEffect: {
                name: 'Sapling',
                abilities: [{
                  trigger: { targeted: true },
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