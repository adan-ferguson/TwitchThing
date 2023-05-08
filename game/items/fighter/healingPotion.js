export default {
  levelFn: function(level){
    return {
      effect: {
        abilities: [{
          trigger: { active: true },
          uses: level + 1,
          conditions: {
            hpPctBelow: 0.999
          },
          actions: [{
            gainHealth: {
              scaling: {
                hpMax: 0.5
              }
            }
          }]
        }]
      },
      displayName: 'Health Potion'
    }
  },
  orbs: [2, 3, '...']
}