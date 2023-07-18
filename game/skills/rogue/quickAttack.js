export default function(level){
  const physPower = 0.6 + 0.2 * level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        turnRefund: 0.5,
        cooldown: 10000 * Math.pow(0.9, level - 1),
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