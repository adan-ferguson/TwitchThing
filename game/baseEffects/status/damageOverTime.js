export default function({ damage = 0, damageType = 'phys' } = {}){
  return {
    polarity: 'debuff',
    stacking: 'stack',
    abilities: [{
      abilityId: 'damageOverTime',
      trigger: { instant: true },
      cooldown: 5000,
      actions: [{
        takeDamage: {
          scaling: { flat: damage },
          damageType
        }
      }]
    }]
  }
}