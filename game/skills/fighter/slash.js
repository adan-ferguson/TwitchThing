export default function(level){
  const physPower = 1.2 + 0.3 * level
  return {
    effect: {
      abilities: [{
        trigger: { active: true },
        cooldown: 10000,
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