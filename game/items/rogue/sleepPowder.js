export default function(level){
  const duration = 5000 + level * 5000
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: duration * 2,
        actions: [{
          applyStatusEffect: {
            targets: 'enemy',
            statusEffect: {
              base: {
                asleep: {
                  duration
                }
              }
            }
          }
        }]
      }]
    },
    orbs: level * 3 + 2
  }
}