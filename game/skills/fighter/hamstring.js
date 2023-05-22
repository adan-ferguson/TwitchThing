export default function(level){
  const physPower = 1.3 + level * 0.1
  const speed = -25 - level * 15
  return {
    effect: {
      abilities: [{
        trigger: { active: true },
        cooldown: 20000,
        phantomEffect: {
          base: {
            attackAppliesStatusEffect: {
              polarity: 'debuff',
              name: 'hamstrung',
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