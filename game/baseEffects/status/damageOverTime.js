export default function({ damage = 0 } = {}, { stacks = 0 } = {}){
  return {
    polarity: 'debuff',
    stacking: 'stack',
    abilities: [{
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