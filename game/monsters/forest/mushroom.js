import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: toPct(0.8 + tier * 2.2),
      physPower: '-80%',
      magicPower: toPct(0.2 + tier * 1.3)
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
              mushroomSpores: { tier }
            }]
          }]
        }
      }
    ]
  }
}