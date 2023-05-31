export default function(level){
  const multi = 0.5 + 'x'
  return {
    effect: {
      metaEffects: [{
        subject: 'attached',
        effect: {
          exclusiveStats: {
            magicPower: multi,
            physPower: multi,
            nextTurnTime: 1 - level * 0.5,
          }
        }
      }],
    },
    orbs: -7 + level * 10,
    maxLevel: 2,
    vars: {
      targets: 'attached'
    }
  }
}