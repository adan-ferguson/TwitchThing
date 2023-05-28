export default function({ damage = 0, damageType = 'phys' } = {}){
  return {
    polarity: 'debuff',
    stacking: 'stack',
    abilities: [{
      abilityId: 'damageOverTime',
      trigger: { instant: true },
      initialCooldown: 3000,
      actions: [{
        takeDamage: {
          scaling: { flat: damage },
          damageType
        }
      }]
    }]
  }
}