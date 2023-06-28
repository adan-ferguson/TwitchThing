export default function(level){
  const block = level * 0.06 + 0.06
  const pctReturn = 0.2 + level * 0.2
  return {
    orbs: 2 + level * 3,
    effect: {
      stats: {
        block
      },
      abilities: [{
        trigger: 'hitByAttack',
        abilityId: 'spikedShield',
        vars: {
          pctReturn
        },
        conditions: {
          owner: {
            hasStatusEffect: {
              name: 'block'
            }
          },
          data: {
            damageType: 'phys'
          }
        },
        actions: [{
          spikedShield: {
            pctReturn
          }
        }]
      }]
    }
  }
}