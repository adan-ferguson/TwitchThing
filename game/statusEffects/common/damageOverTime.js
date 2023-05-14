export default function({ damage = 0 }, { stacks = 1 }){
  return {
    isBuff: false,
    stacking: 'stack',
    abilities: [{
      trigger: { instant: true },
      initialCooldown: 1000,
      actions: [{
        takeDamage: {
          scaling: {
            flat: damage * stacks
          },
          damageType: 'phys'
        }
      }]
    }]
  }
}