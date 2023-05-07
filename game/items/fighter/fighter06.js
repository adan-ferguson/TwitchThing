export default {
  levelFn: function(level){
    const physScaling = 0.1 + 0.1 * level
    return {
      displayName: 'Serrated Blade',
      effect: {
        abilities: [{
          trigger: {
            attackHit: {
              damageType: 'phys'
            }
          },
          abilityId: 'serratedBladeTrigger',
          conditions: {
            source: 'attached'
          },
          actions: [
            // {
            //   applyStatusEffect: {
            //     // actionId: 'serratedBladeBleed',
            //     // vars: {
            //     //   physScaling
            //     // }
            //   }
            // }
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