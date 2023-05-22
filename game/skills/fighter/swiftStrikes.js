export default function(level){
  const physPower = 0.4
  const hits = 3 + level
  return {
    effect: {
      abilities: [{
        trigger: { active: true },
        cooldown: 12000,
        actions: [{
          attack: {
            hits,
            scaling: {
              physPower
            }
          }
        }]
      }]
    }
  }
}