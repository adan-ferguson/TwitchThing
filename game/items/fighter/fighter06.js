export default {
  levelFn: function(level){
    const physScaling = 0.1 + 0.1 * level
    return {
      displayName: 'Serrated Blade',
      effect: {
        abilities: [{
          trigger: 'physAttackHit',
          abilityId: 'serratedBladeTrigger',
          conditions: {
            source: 'attached'
          },
          actions: [
            {
              addStatusEffect: {
                // actionId: 'serratedBladeBleed',
                // vars: {
                //   physScaling
                // }
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