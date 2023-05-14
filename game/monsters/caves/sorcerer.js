export default {
  baseStats: {
    hpMax: '-20%',
    magicPower: '+110%',
    physPower: '-40%'
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