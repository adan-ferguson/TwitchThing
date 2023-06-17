export default function(){
  return {
    baseStats: {
      hpMax: '+40%',
      speed: -30,
      physPower: '+60%'
    },
    items: [
      {
        name: 'Constrict',
        effect: {
          abilities: [{
            trigger: 'active',
            uses: 1,
            abilityId: 'constrict',
            vars: { speed: -5 },
            actions: [{
              applyStatusEffect: {
                targets: 'enemy',
                statusEffect: {
                  polarity: 'debuff',
                  name: 'constricted',
                  stats: {
                    speed: -20
                  },
                  stacking: 'stack',
                }
              }
            },{
              trigger: 'takeTurn',
              abilityId: 'constrictAddStack',
              actions: [{
                modifyEffect: {
                  targets: 'enemy',
                  name: 'constricted',
                  sourceKey: 'self',
                  modification: {
                    stacks: 1
                  }
                }
              }]
            }]
          }]
        }
      }
    ]
  }
}