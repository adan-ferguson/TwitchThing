export default function(level){
  const physPower = (1.1 + level * 0.6) + 'x'
  return {
    effect: {
      metaEffects: [{
        metaEffectId: 'spear',
        subject: { key: 'attached' },
        effectModification: {
          exclusiveStats: {
            physPower
          },
          exclusiveMods: [{
            ignoreDef: 'phys'
          }]
        }
      }],
    },
    orbs: 1 + level * 3,
    vars: {
      physPower
    }
  }
}