export default function(level){
  const physPower = 1.3 + 0.3 * level
  return {
    effect: {
      abilities: [{
        trigger: { active: true },
        cooldown: 9000,
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