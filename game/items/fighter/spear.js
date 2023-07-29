export default function(level){
  const physPower = (1.3 + level * 0.5) + 'x'
  return {
    effect: {
      metaEffects: [{
        metaEffectId: 'spear',
        subject: { key: 'attached' },
        effectModification: {
          abilityModification: {
            exclusiveStats: {
              physPower
            },
          },
          exclusiveMods: [{
            ignoreDef: 'phys'
          }]
        }
      }],
    },
    orbs: 2 + level * 1,
    vars: {
      physPower
    }
  }
}