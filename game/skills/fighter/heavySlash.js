export default function(level){
  const physPower = 2 + 1 * level
  return {
    effect: {
      abilities: [{
        trigger: { active: true },
        initialCooldown: 15000 + level * 5000,
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