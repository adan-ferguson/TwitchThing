import { magicScalingMod, silencedMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import gainHealthAction from '../../actions/gainHealthAction.js'

export default {
  baseStats: {
    hpMax: '-10%',
    physPower: '-50%',
    magicPower: '+20%',
    speed: 55
  },
  items: [
    {
      name: 'Bear Form',
      abilities: {
        active: {
          initialCooldown: 11000,
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
                  hpMax: '+220%',
                  physPower: '+220%',
                  speed: -100,
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
          initialCooldown: 3500,
          actions: [
            gainHealthAction({
              scaling: { magicPower: 1 }
            })
          ]
        }
      }
    }
  ]
}