export default {
  levelFn: function(level){
    const speed = 10 + level * 20
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
