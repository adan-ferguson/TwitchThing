export default function(level){
  const physPower = (0.9 + level * 0.6) + 'x'
  return {
    effect: {
      metaEffects: [{
        metaEffectId: 'spear',
        subjectKey: 'attached',
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