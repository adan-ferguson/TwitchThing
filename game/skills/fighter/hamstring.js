export default function(level){
  const physPower = 1.3 + level * 0.1
  const speed = -30 - level * 10
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 12000,
        phantomEffect: {
          base: {
            attackAppliesStatusEffect: {
              polarity: 'debuff',
              name: 'hamstrung',
              stacking: 'stack',
              stats: {
                speed
              }
            }
          }
        },
        actions: [{
          attack: {
            scaling: {
              physPower
            }
          }
        }]
      }]
    }
  }
}