export default function(level){
  const physPower = (1.4 + level * 0.6) + 'x'
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
    orbs: 2 + level * 2,
    vars: {
      physPower
    }
  }
}