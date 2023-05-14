export default {
  isBuff: false,
  abilities: [{
    trigger: { instant: true },
    initialCooldown: 1000,
    actions: [{
      takeDamage: {
        scaling: {
          parentEffectParam: {
            damage: 1
          }
        },
        damageType: 'phys'
      }
    }]
  }]
}