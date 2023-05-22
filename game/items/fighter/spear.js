export default function(level){
  const physPower = (1 + level * 0.5) + 'x'
  return {
    effect: {
      metaEffect: {
        attached: {
          metaEffectId: 'spear',
          exclusiveStats: {
            physPower
          },
          exclusiveMods: [{
            ignoreDef: 'phys'
          }]
        }
      },
    },
    orbs: 1 + level * 3,
    vars: {
      affects: 'attached',
      physPower
    }
  }
}