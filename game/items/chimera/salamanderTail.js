export default function(level){
  const magicPower = 0.25 * level
  return {
    effect: {
      abilities: [{
        trigger: 'attackHit',
        conditions: {
          data: {
            damageType: 'phys'
          }
        },
        actions: [{
          dealDamage: {
            targets: 'target',
            damageType: 'magic',
            scaling: {
              magicPower
            }
          }
        }]
      }]
    },
    orbs: level * 4 + 1
  }
}