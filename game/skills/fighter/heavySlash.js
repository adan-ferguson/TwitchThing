export default function(level){
  const physPower = 1.6 + 0.8 * level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 15000 + level * 5000,
        actions: [{
          attack: {
            scaling: {
              physPower
            }
          }
        }]
      }]
    },
    vars: {
      physPower
    }
  }
}