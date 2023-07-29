export default function(level){
  const hpMax = 0.25 + 0.15 * level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 10000,
        actions: [{
          attack: {
            scaling: {
              hpMax
            }
          }
        }]
      }]
    }
  }
}