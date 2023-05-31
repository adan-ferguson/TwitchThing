export default function(level){
  const magicPower = (0.8 + level * 0.4) + 'x'
  return {
    effect: {
      metaEffects: [{
        subject: 'attached',
        effect: {
          exclusiveStats: {
            magicPower,
            cooldownTime: Math.pow(0.9, level - 1) * 0.8
          }
        }
      }],
    },
    loadoutModifiers: {
      self: {
        restrictions: {
          slot: 1
        }
      }
    },
    orbs: 1 + level * 4,
    vars: {
      targets: 'attached'
    }
  }
}