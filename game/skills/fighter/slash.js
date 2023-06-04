export default function(level){
  const physPower = 1.3 + 0.3 * level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: Math.floor(7000 * Math.pow(0.9, level - 1)),
        actions: [{
          attack: {
            scaling: {
              physPower
            }
          }
        }]
      }]
    }
  }
}