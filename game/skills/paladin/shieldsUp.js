export default function(level){
  const multiplier = 1 + level * 0.5
  return {
    displayName: 'Shields Up!',
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 20000 * Math.pow(0.9, level - 1),
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