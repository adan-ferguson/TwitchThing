export default {
  baseStats: {
    physPower: '+30%',
    speed: -10
  },
  items: [
    {
      name: 'Web Shot',
      effect: {
        abilities: [{
          trigger: { active: true },
          cooldown: 9000,
          actions: [{
            applyStatusEffect: {
              affects: 'enemy',
              statusEffect: {
                name: 'webbed',
                stacking: 'stack',
                persisting: true,
                duration: 10000,
                polarity: 'debuff',
                stats: {
                  speed: -25
                }
              }
            }
          }]
        }]
      }
    }
  ]
}