export default function(){
  return {
    baseStats: {
      hpMax: '+50%',
      speed: -20,
      physPower: '-20%'
    },
    items: [
      {
        name: 'Disease',
        effect: {
          abilities: [{
            abilityId: 'zombieDisease',
            trigger: 'attackHit',
            conditions: {
              random: 0.2
            },
            actions: [{
              applyStatusEffect: {
                targets: 'target',
                statusEffect: {
                  name: 'diseased',
                  persisting: true,
                  polarity: 'debuff',
                  stacking: 'stack',
                  stackingId: 'zombieDisease',
                  stats: {
                    physPower: '0.9x',
                    hpMax: '0.9x'
                  }
                }
              }
            }]
          }]
        }
      }
    ]
  }
}