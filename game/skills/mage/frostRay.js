export default function(level){
  const cooldown = 7000 + level * 3000
  const speed = -30 - level * 20
  const magicPower = 0.5 + 0.2 * level
  return {
    effect: {
      abilities: [{
        tags: ['spell'],
        trigger: 'active',
        cooldown,
        phantomEffect: {
          base: {
            attackAppliesStatusEffect: {
              stats: {
                speed
              },
              polarity: 'debuff',
              name: 'chilled',
              stacking: 'stack',
            }
          }
        },
        actions: [{
          attack: {
            scaling: {
              magicPower
            },
            damageType: 'magic'
          }
        }]
      }]
    }
  }
}