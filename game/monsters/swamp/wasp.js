export default function(){
  const scaling = {
    physPower: 0.3
  }
  const chance = 0.25
  const duration = 30000
  return {
    baseStats: {
      hpMax: '-50%',
      physPower: '-50%',
      speed: 200
    },
    items: [{
      name: 'Stinger',
      effect: {
        abilities: [{
          vars: {
            chance,
            scaling,
            duration
          },
          abilityId: 'waspSting',
          trigger: 'attackHit',
          conditions: {
            random: chance
          },
          actions: [{
            applyStatusEffect: {
              targets: 'target',
              statusEffect: {
                base: {
                  damageOverTime: {
                    damage: {
                      scaledNumber: scaling
                    }
                  }
                },
                name: 'poisoned',
                duration,
                persisting: true
              }
            }
          }]
        }]
      }
    }]
  }
}