export default function(level){
  const magicPower = 0.4 * level
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
    orbs: level * 3 + 1
  }
}