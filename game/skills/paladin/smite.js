export default function(level){
  const power = 0.4 + level * 0.4
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 7500,
        actions: [{
          attack: {
            damageType: 'phys',
            scaling: {
              physPower: power,
            }
          }
        },{
          attack: {
            damageType: 'magic',
            scaling: {
              magicPower: power,
            }
          }
        }]
      }]
    }
  }
}