export default function({ damage = 0, damageType = 'phys' } = {}){
  return {
    polarity: 'debuff',
    stacking: 'stack',
    name: 'damageOverTime',
    abilities: [{
      trigger: 'instant',
      abilityId: 'damageOverTime',
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