export default {
  levelFn: function(level){
    const speed = 25 + level * 15
    const duration = 8000
    return {
      effect: {
        abilities: [{
          trigger: {
            combatTime: 1
          },
          actions: [{
            applyStatusEffect: {
              affects: 'self',
              statusEffect: {
                name: 'sprinting',
                polarity: 'buff',
                duration,
                stats: {
                  speed
                }
              }
            }
          }]
        }]
      },
      vars: { speed, duration }
    }
  },
  orbs: [3, '...']
}
