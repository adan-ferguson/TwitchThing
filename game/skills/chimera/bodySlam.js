export default function(level){
  const hpMax = 0.4 + 0.2 * level
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