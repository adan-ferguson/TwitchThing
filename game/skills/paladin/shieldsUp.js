export default function(level){
  const multiplier = 1.0 + level * 0.5
  return {
    displayName: 'Shields Up!',
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 30000,
        conditions: {
          owner: {
            doesntHaveStatusEffectWithName: 'block'
          }
        },
        actions: [{
          shieldsUp: {
            multiplier
          }
        }]
      }]
    }
  }
}