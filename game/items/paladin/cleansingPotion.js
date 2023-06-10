export default function(level){
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        uses: 1 + level * 2,
        conditions: {
          owner: {
            hasDebuff: true
          }
        },
        actions: [{
          removeStatusEffect: {
            targets: 'self',
            polarity: 'debuff'
          }
        },{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'Cleansed',
              polarity: 'buff',
              duration: 15000,
              abilities: [{
                trigger: 'gainingDebuff',
                replacements: {
                  dataMerge: {
                    cancelled: true
                  }
                }
              }]
            }
          }
        }]
      }]
    },
    orbs: 5 + level * 3
  }
}