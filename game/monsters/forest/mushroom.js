

export default function(){
  return {
    baseStats: {
      hpMax: '+80%',
      physPower: '-80%',
      magicPower: '+20%'
    },
    items: [
      {
        name: 'Passive',
        effect: {
          mods: [{
            freezeActionBar: true
          }]
        }
      },
      {
        name: 'Regeneration',
        effect: {
          abilities: [{
            trigger: 'instant',
            initialCooldown: 5000,
            actions: [{
              gainHealth: {
                scaling: {
                  magicPower: 0.4
                }
              }
            }]
          }]
        }
      },
      {
        name: 'Spores',
        effect: {
          abilities: [{
            trigger: 'hitByAttack',
            abilityId: 'mushroomSpores',
            actions: [{
              mushroomSpores: {}
            }]
          }]
        }
      }
    ]
  }
}