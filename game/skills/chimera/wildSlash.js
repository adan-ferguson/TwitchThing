export default function(level){
  const pct = 0.08 + 0.04 * level
  const physPower = 1.4 + 0.5 * level
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 10000,
        actions: [{
          takeDamage: {
            scaling: {
              hp: pct
            }
          }
        },{
          attack: {
            scaling: {
              physPower
            }
          }
        }]
      }]
    }
  }
}