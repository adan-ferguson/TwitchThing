export default function({ damage = 0 } = {}){
  return {
    polarity: 'debuff',
    stacking: 'stack',
    abilities: [{
      trigger: { instant: true },
      initialCooldown: 1000,
      actions: [{
        takeDamage: {
          scaling: { flat: damage },
          damageType: 'phys'
        }
      }]
    }]
  }
}