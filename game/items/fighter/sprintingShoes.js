export default {
  levelFn: function(level){
    const speed = 30 + level * 20
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
                isBuff: true,
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
