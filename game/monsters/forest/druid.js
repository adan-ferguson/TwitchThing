export default function(){
  return {
    baseStats: {
      hpMax: '-15%',
      physPower: '-50%',
      magicPower: '+60%',
      speed: 40
    },
    items: [
      {
        name: 'Bear Form',
        effect: {
          abilities: [{
            trigger: 'active',
            initialCooldown: 10000,
            abilityId: 'bearForm',
            uses: 1,
            actions: [{
              applyStatusEffect: {
                targets: 'self',
                statusEffect: {
                  name: 'Bear Form',
                  statusEffectId: 'bearForm',
                  mods: [{
                    silenced: true
                  }],
                  stats: {
                    hpMax: '+220%',
                    physPower: '+220%',
                    speed: -40
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
          abilities: [{
            trigger: 'active',
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