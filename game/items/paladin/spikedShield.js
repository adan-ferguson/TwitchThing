export default function(level){
  const block = level * 0.04 + 0.08
  const pctReturn = 0.2 + level * 0.1
  return {
    orbs: level * 5,
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
            hasStatusEffectWithName: 'block'
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