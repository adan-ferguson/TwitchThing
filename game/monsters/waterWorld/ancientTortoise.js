import { spikedShellAbility } from '../../commonMechanics/spikedShellAbility.js'
import { toPct } from '../../utilFunctions.js'

export default function(tier){
  return {
    baseStats: {
      hpMax: toPct(2 + tier * 8),
      physPower: '+50%',
      speed: -60,
    },
    items: [{
      name: 'Withdraw',
      effect: {
        abilities: [{
          trigger: 'active',
          uses: 1,
          conditions: {
            owner: {
              hpPctBelow: 0.5
            }
          },
          actions: [{
            applyStatusEffect: {
              targets: 'self',
              statusEffect: {
                name: 'Withdrawn',
                mods: [{ freezeActionBar: true }],
                duration: 10000,
                stats: {
                  physDef: '90%',
                  magicDef: '90%'
                }
              }
            }
          }]
        }]
      }
    },{
      name: 'Spiked Shell',
      effect: {
        abilities: [spikedShellAbility(0.08)]
      }
    }]
  }
}