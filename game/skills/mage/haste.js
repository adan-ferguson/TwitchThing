export default function(level){
  const cooldown = 30000 + level * 15000
  const speed = 50 + level * 50
  const cooldownMultiplier = 1 - speed / (100 + speed)
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        tags: ['spell'],
        cooldown,
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'haste',
              polarity: 'buff',
              persisting: true,
              duration: 10000,
              stats: {
                speed,
                cooldownMultiplier
              }
            }
          }
        }]
      }]
    }
  }
}