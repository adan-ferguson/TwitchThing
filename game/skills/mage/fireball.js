export default function(level){
  const cooldown = 12000 + level * 4000
  const magicPower = 0.9 + level * 0.6
  const dotPower = magicPower / 3
  return {
    effect: {
      abilities: [{
        tags: ['spell'],
        trigger: 'active',
        cooldown,
        actions: [{
          attack: {
            scaling: {
              magicPower
            },
            damageType: 'magic',
            onHit: {
              applyStatusEffect: {
                targets: 'target',
                statusEffect: {
                  base: {
                    damageOverTime: {
                      damage: {
                        scaledNumber: {
                          magicPower: dotPower
                        }
                      },
                      damageType: 'magic'
                    }
                  },
                  name: 'burned'
                }
              }
            }
          }
        }]
      }]
    }
  }
}