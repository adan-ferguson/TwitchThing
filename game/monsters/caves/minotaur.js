export default {
  baseStats: {
    physPower: '+40%',
    speed: -30,
    hpMax: '+350%'
  },
  items: [
    {
      name: 'Execute',
      effect: {
        abilities: [{
          trigger: { active: true },
          initialCooldown: 30000,
          actions: [{
            attack: {
              scaling: {
                physPower: 5
              }
            }
          }]
        }]
      }
    }
  ]
}