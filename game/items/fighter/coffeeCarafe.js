export default function(level){
  const speed = 20 + level * 20
  const duration = 20000
  return {
    effect: {
      abilities: [{
        trigger: { rest: true },
        actions:[{
          applyStatusEffect: {
            affects: 'self',
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
    orbs: level * 4
  }
}