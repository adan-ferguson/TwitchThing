export default function(level){
  const magicPower = 0.3 + 0.6 * level
  return {
    displayName: 'Imbued Weapons',
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
    }
  }
}