export default function(level){
  const physPower = 1 + 0.3 * level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 15000,
        actions: [{
          attack: {
            scaling: {
              physPower
            },
            lifesteal: 0.5
          }
        }]
      }]
    }
  }
}