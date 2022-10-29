import { magicScalingMod, silencedMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import gainHealthAction from '../../actions/gainHealthAction.js'

export default {
  baseStats: {
    hpMax: '-20%',
    physPower: '-50%',
    speed: '+50%'
  },
  items: [
    {
      name: 'Bear Form',
      abilities: {
        active: {
          initialCooldown: 15000,
          description: 'Switch to Bear Form.',
          uses: 1,
          actions: [
            statusEffectAction({
              effect: {
                stacking: false,
                mods: [silencedMod],
                displayName: 'Bear Form',
                description: 'Modified stats, can only basic attack.',
                stats: {
                  hpMax: '+250%',
                  physPower: '+250%',
                  speed: '-50%',
                }
              }
            })
          ]
        }
      }
    },
    {
      name: 'Regrowth',
      mods: [magicScalingMod],
      abilities: {
        active: {
          initialCooldown: 6000,
          actions: [
            gainHealthAction({
              magicScaling: 1
            })
          ]
        }
      }
    }
  ]
}