export default function(level){
  const physPower = 0.5 * Math.pow(0.8, level - 1)
  const hits = 1 + level * 2
  return {
    effect: {
      abilities: [{
        trigger: 'active',
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