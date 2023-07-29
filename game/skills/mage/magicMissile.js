export default function(level){
  const magicPower = 0.5
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 6000 + level * 2000,
        actions: [{
          attack: {
            scaling: {
              magicPower
            },
            hits: 1 + level * 2,
            damageType: 'magic',
          }
        }]
      }]
    }
  }
}