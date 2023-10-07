import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: '-15%',
      physPower: '-50%',
      magicPower: toPct(0.6 + tier * 0.6),
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
                    hpMax: toPct(2.2 + tier * 2.2),
                    physPower: toPct(2.2 + tier * 2.2),
                    speed: -40 + tier * 140
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