export default function(level){
  const magicPower = (1 + level * 0.5) + 'x'
  return {
    effect: {
      metaEffects: [{
        subject: 'attached',
        effect: {
          exclusiveStats: {
            magicPower
          }
        }
      }],
    },
    orbs: -1 + level * 4,
    vars: {
      targets: 'attached'
    }
  }
}