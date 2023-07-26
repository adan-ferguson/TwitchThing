export default function(level){
  const speed = 20 + level * 30
  const duration = 20000
  return {
    effect: {
      stats: {
        startingFood: level
      },
      abilities: [{
        trigger: 'rest',
        actions:[{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'caffeineRush',
              polarity: 'buff',
              persisting: true,
              stacking: 'extend',
              duration,
              stats: {
                speed
              }
            }
          }
        }]
      }]
    },
    orbs: 2 + level * 2
  }
}