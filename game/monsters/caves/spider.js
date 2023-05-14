export default {
  baseStats: {
    physPower: '-10%',
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
                isBuff: false,
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