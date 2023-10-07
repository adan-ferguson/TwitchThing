export function darkArmorOfDoomEffect(startingStacks){
  return {
    abilities: [{
      trigger: 'startOfCombat',
      uses: 1,
      actions: [{
        applyStatusEffect: {
          targets: 'self',
          statusEffect: {
            name: 'darkArmor',
            startingStacks,
            polarity: 'buff',
            stats: {
              physDef: '10%',
              magicDef: '10%'
            },
            abilities: [{
              trigger: 'instant',
              initialCooldown: 3000,
              actions: [{
                modifyStatusEffect: {
                  subject: {
                    key: 'self'
                  },
                  modification: {
                    stacks: -1
                  }
                }
              }]
            }]
          }
        }
      }]
    }]
  }
}