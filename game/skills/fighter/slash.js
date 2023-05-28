export default function(level){
  const physPower = 1.4 + 0.2 * level
  return {
    effect: {
      abilities: [{
        trigger: { active: true },
        cooldown: Math.floor(9000 * Math.pow(0.9, level - 1)),
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