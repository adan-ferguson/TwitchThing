export default {
  baseStats: {
    hpMax: '-10%',
    magicPower: '+110%',
    physPower: '-30%'
  },
  items: [
    {
      name: 'Lightning Bolt',
      effect: {
        abilities: [{
          trigger: { active: true },
          initialCooldown: 4000,
          cooldown: 8000,
          actions: [{
            attack: {
              scaling: {
                magicPower: 2
              },
              damageType: 'magic',
              range: [0, 1]
            }
          }]
        }]
      }
    }
  ]
}