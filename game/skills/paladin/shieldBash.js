export default function(level){
  const physPower = 1
  const stunBase = 1000
  const stunScale = level * 1000
  return {
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 10000 + 2000 * level,
        actions: [{
          attack: {
            damageType: 'phys',
            scaling: {
              physPower,
            },
            onHit: {
              applyStatusEffect: {
                targets: 'target',
                statusEffect: {
                  base: {
                    stunned: {
                      duration: {
                        scaledNumber: {
                          flat: stunBase,
                          effectStats: {
                            subjectKey: 'attached',
                            stat: 'block',
                            base: stunScale
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }]
      }]
    },
    loadoutModifiers: [{
      subjectKey: 'attached',
      restrictions: {
        hasStat: 'block'
      }
    }]
  }
}