export default function(level){
  const physPower = 1.2 + level * 0.2
  const speed = -15 - level * 10
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 12000,
        actions: [{
          attack: {
            scaling: {
              physPower
            },
            onHit: {
              applyStatusEffect: {
                targets: 'target',
                statusEffect: {
                  base: {
                    slowed: {
                      speed
                    }
                  },
                  name: 'hamstrung',
                }
              }
            }
          }
        }]
      }]
    }
  }
}