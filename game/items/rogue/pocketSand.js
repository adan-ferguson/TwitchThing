export default function(level){
  const duration = 3000 + level * 2000
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 20000,
        actions: [{
          applyStatusEffect: {
            targets: 'enemy',
            statusEffect: {
              base: {
                blinded: {
                  duration: duration
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