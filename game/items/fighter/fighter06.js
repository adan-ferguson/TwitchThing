export default {
  levelFn: function(level){
    const physScaling = 0.1 + 0.1 * level
    return {
      displayName: 'Serrated Blade',
      effect: {
        abilities: [{
          trigger: 'physAttackHit',
          name: 'serratedBladeTrigger',
          conditions: {
            source: 'attached'
          },
          actions: [
            {
              statusEffect: {
                name: 'serratedBladeBleed',
                vars: {
                  physScaling
                }
              }
            }
          ]
        }]
      },
      vars: {
        physScaling
      }
    }
  },
  orbs: [5,3,'...']
}