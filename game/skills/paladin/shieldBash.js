export default function(level){
  const physPower = 0.8 + level * 0.2
  const stunMin = 1000 + level * 1000
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 9000 + 3000 * level,
        actions: [{
          shieldBash: {
            physPower,
            stunMin,
          }
        }]
      }]
    }
  }
}