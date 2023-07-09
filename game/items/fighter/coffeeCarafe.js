export default function(level){
  const speed = 20 + level * 30
  const duration = 30000
  return {
    effect: {
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
    orbs: 3 + level * 2
  }
}