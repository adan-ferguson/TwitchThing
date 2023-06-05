export default function(level){
  const duration = 12000 + level * 6000
  const cooldown = 45000 + level * 15000
  const magicPower = 1.4 + level * 0.6
  return {
    effect: {
      abilities: [{
        tags: ['spell'],
        trigger: 'active',
        cooldown,
        abilityId: 'lightningStorm',
        actions: [{
          applyStatusEffect: {
            targets: 'self',
            statusEffect: {
              name: 'lightningStorm',
              polarity: 'buff',
              duration,
              abilities: [{
                trigger: 'instant',
                initialCooldown: 3000,
                actions: [{
                  attack: {
                    damageType: 'magic',
                    scaling: {
                      magicPower
                    },
                    range: [0, 1],
                    onHit: {
                      maybe: {
                        chance: 1 / 3,
                        action: {
                          applyStatusEffect: {
                            targets: 'target',
                            statusEffect: {
                              base: {
                                stunned: 3000
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
        }],
        vars: {
          duration,
          magicPower
        }
      }]
    }
  }
}