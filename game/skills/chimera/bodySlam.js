export default function(level){
  const hpMax = 0.25 + 0.15 * level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: Math.floor(10000 * Math.pow(0.92, level - 1)),
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