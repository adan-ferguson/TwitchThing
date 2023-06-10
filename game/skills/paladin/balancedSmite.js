export default function(level){
  const power = 2.4 + level * 0.8
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 15000 * Math.pow(0.8, level - 1),
        actions: [{
          balancedSmite: {
            power
          }
        }]
      }]
    }
  }
}