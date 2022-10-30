import statusEffectAction from '../../actions/statusEffectAction.js'
import { freezeActionBarMod, magicScalingMod } from '../../mods/combined.js'
import gainHealthAction from '../../actions/gainHealthAction.js'

export default {
  baseStats: {
    hpMax: '+120%',
    physPower: '+50%',
    magicPower: '-20%',
    speed: -80
  },
  items: [{
    name: 'Withdraw',
    mods: [magicScalingMod],
    abilities: {
      active: {
        uses: 1,
        conditions: {
          hpPctBelow: 0.5
        },
        actions: [
          statusEffectAction({
            effect: {
              displayName: 'Withdrawn',
              duration: 10000,
              mods: [freezeActionBarMod],
              stats: {
                physDef: '80%',
                magicDef: '80%'
              },
              abilities: {
                tick: {
                  cooldown: 1000,
                  actions: [
                    gainHealthAction({
                      magicPower: 1
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