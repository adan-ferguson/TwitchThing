export default function(level){
  const power = 2.0 + level * 1.2
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 10000,
        actions: [{
          balancedSmite: {
            power
          }
        }]
      }]
    }
  }
}