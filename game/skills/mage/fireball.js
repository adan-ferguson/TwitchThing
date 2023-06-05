export default function(level){
  const cooldown = 10000 + level * 2000
  const speedFlat = -20 - level * 10
  const speedScaling = -10 - level * 5
  const magicPower = 0.5 + 0.1 * level
  return {
    effect: {
      // abilities: [{
      //   trigger: 'active',
      //   cooldown,
      //   phantomEffect: {
      //     base: {
      //       attackAppliesStatusEffect: {
      //         base: {
      //           statChange: {
      //             speed: {
      //               scaledNumber: {
      //                 flat: speedFlat,
      //                 magicPowerPct: speedScaling
      //               }
      //             }
      //           }
      //         },
      //         polarity: 'debuff',
      //         name: 'chilled',
      //       }
      //     }
      //   },
      //   actions: [{
      //     attack: {
      //       scaling: {
      //         magicPower
      //       },
      //       damageType: 'magic'
      //     }
      //   }]
      // }]
    }
  }
}