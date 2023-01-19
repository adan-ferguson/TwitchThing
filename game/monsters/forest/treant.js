import statusEffectAction from '../../actions/statusEffectAction.js'
import { magicScalingMod } from '../../mods/combined.js'
import removeStackAction from '../../actions/removeStackAction.js'

export default {
  baseStats: {
    speed: -120,
    hpMax: '+140%',
    physPower: '+60%'
  },
  items: [{
    name: 'Sprout Saplings',
    abilities: {
      startOfCombat: {
        mods: [magicScalingMod],
        uses: 1,
        description: 'At the start of combat, summon 3 saplings which each block an ability.',
        actions: Array(3).fill(
          statusEffectAction({
            effect: {
              stacking: true,
              displayName: 'Sapling',
              description: 'Blocks an ability.',
              isBuff: true,
              abilities: {
                targeted: {
                  actions: [
                    removeStackAction(),
                    {
                      type: 'cancel',
                      cancelReason: 'Absorbed'
                    }
                  ]
                }
              }
            }
          })
        )
      }
    }
  }]
}