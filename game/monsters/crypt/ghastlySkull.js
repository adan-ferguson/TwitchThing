import attackAction from '../../actions/attackAction.js'
import { magicScalingMod } from '../../mods/combined.js'
import takeDamageAction from '../../actions/takeDamageAction.js'

export default {
  baseStats: {
    speed: -233,
    physPower: '-50%',
    magicPower: '-99.99999%',
    hpMax: '-50%'
  },
  items: [
    {
      name: 'Explode!',
      mods: [magicScalingMod],
      scaledStats: {
        scaling: {
          property: 'hpPct'
        },
        stats: {
          magicPower: '+500%'
        }
      },
      abilities: {
        active: {
          description: 'Self-destruct and deal HEAVY magic damage, increased by amount of health remaining.',
          actions: [
            [attackAction({ damageType: 'magic' })],
            [
              takeDamageAction({
                scaling: {
                  hp: 1
                },
                damageType: 'magic',
                ignoreDefense: true
              })
            ]
          ]
        }
      }
    }
  ]
}

