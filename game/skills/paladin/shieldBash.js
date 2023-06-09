export default function(level){
  const physPower = 0.8 + level * 0.2
  const stunBase = 500 + level * 500
  const scaledNumber = {
    flat: stunBase,
    effectStats: {
      subjectKey: 'attached',
      stat: 'block',
      base: stunBase * 2
    }
  }
  return {
    effect: {
      abilities: [{
        abilityId: 'shieldBash',
        trigger: 'active',
        cooldown: 8000 + 2000 * level,
        vars: {
          physPower,
          stunBase,
          scaledNumber
        },
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
                        scaledNumber
                      }
                    }
                  }
                }
              }
            }
          }
        }]
      }]
    }
  }
}