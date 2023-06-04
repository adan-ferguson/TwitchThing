import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'
import { freezeActionBarMod, magicScalingMod } from '../../mods/combined.js'
import gainHealthAction from '../../actions/actionDefs/common/gainHealthAction.js'

export default {
  baseStats: {
    hpMax: '+120%',
    physPower: '+50%',
    magicPower: '-20%',
    speed: -100
  },
  items: [{
    name: 'Withdraw',
    mods: [magicScalingMod],
    abilities: {
      active: {
        uses: 1,
        description: 'Usable only when below 50% health. Hide in shell for 10 seconds to regain health.',
        conditions: {
          owner: {
            hpPctBelow: 0.5
          }
        },
        actions: [
          statusEffectAction({
            effect: {
              displayName: 'Withdrawn',
              duration: 10000,
              mods: [freezeActionBarMod],
              stats: {
                physDef: '90%',
                magicDef: '90%'
              },
              abilities: {
                tick: {
                  cooldown: 1000,
                  actions: [
                    gainHealthAction({
                      scaling: { magicPower: 0.5 }
                    })
                  ]
                }
              }
            }
          })
        ]
      }
    }
  }]
}