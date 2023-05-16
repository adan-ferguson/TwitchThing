export default function({ damage = 0 } = {}, stacks = 1){
  return {
    polarity: 'debuff',
    stacking: 'stack',
    abilities: [{
      abilityId: 'damageOverTime',
      trigger: { instant: true },
      cooldown: 1000,
      actions: [{
        takeDamage: {
          scaling: { flat: damage * stacks },
          damageType: 'phys'
        }
      }]
    }]
  }
}