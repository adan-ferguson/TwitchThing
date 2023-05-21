export default function(level){
  const speed = 40 + level * 10
  const duration = 4000 + level * 1000
  return {
    effect: {
      abilities: [{
        trigger: {
          combatTime: 1
        },
        actions: [{
          applyStatusEffect: {
            affects: 'self',
            statusEffect: {
              name: 'sprinting',
              polarity: 'buff',
              duration,
              stats: {
                speed
              }
            }
          }
        }]
      }]
    },
    vars: { speed, duration },
    orbs: 3 * level
  }
}
