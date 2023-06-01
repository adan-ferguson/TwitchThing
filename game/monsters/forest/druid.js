export default function(){
  return {
    baseStats: {
      hpMax: '-20%',
      physPower: '-50%',
      magicPower: '+40%',
      speed: 30
    },
    items: [
      {
        name: 'Bear Form',
        effect: {
          tags: ['magic'],
          abilities: [{
            trigger: { active: true },
            initialCooldown: 11000,
            abilityId: 'bearForm',
            uses: 1,
            actions: [{
              applyStatusEffect: {
                targets: 'self',
                statusEffect: {
                  name: 'Bear Form',
                  mods: [{
                    silenced: true
                  }],
                  stats: {
                    hpMax: '+220%',
                    physPower: '+220%',
                    speed: -70
                  }
                }
              }
            }]
          }]
        }
      },
      {
        name: 'Regrowth',
        effect: {
          tags: ['magic'],
          abilities: [{
            trigger: { active: true },
            initialCooldown: 5000,
            actions: [{
              gainHealth: {
                scaling: {
                  magicPower: 1
                }
              }
            }]
          }]
        }
      }
    ]
  }
}