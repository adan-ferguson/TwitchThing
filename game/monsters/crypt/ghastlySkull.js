import damageSelfAction from '../../actions/damageSelfAction.js'
import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'

export default {
  baseStats: {
    speed: -200,
    physPower: '-50%',
    hpMax: '-50%'
  },
  items: [
    {
      name: 'Explode',
      mods: [magicScalingMod],
      scaledStats: {
        scaling: {
          property: 'hpPct'
        },
        stats: {
          magicPower: '+400%'
        }
      },
      abilities: {
        active: {
          description: 'Explodes, dealing heavy magic damage, increased by amount of health remaining.',
          actions: [
            attackAction({
              damageType: 'magic',
              continueIfCancelled: true
            }),
            damageSelfAction({
              damagePct: 1,
              ignoreDefense: true
            })
          ]
        }
      }
    }
  ]
}

