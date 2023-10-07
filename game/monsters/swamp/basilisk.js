import { toPct } from '../../utilFunctions.js'

export default function(tier){
  const chance = tier ? 0.9 : 0.2
  return {
    baseStats: {
      hpMax: toPct(0.1 + tier * 1.5),
      physPower: '-30%',
      speed: 10
    },
    items: [
      {
        name: 'Deadly Gaze',
        effect: {
          abilities: [{
            vars: {
              chance,
            },
            abilityId: 'deadlyGaze',
            trigger: 'active',
            initialCooldown: 7000,
            actions: [{
              maybe: {
                chance,
                action: {
                  targetScaledAttack: {
                    damageType: 'magic',
                    scaling: {
                      hpMax: 1
                    }
                  }
                }
              }
            }]
          }]
        }
      }
    ]
  }
}