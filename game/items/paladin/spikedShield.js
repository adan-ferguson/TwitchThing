export default function(level){
  const block = level * 0.2
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
          }
        },
        actions: [{
          dealDamage: {
            targets: 'source',
            damageType: 'phys',
            miscScaling: {
              blockedPhysDamage: pctReturn
            }
          }
        }]
      }]
    }
  }
}