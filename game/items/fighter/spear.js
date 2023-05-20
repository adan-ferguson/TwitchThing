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
          mods: [{
            ignoreDef: 'phys'
          }]
        }
      },
    },
    orbs: 2 + level * 3,
    vars: {
      affects: 'attached',
      physPower
    }
  }
}