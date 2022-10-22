import statusEffectAction from '../../actions/statusEffectAction.js'
import { magicScalingMod } from '../../mods/combined.js'
import removeStackAction from '../../actions/removeStackAction.js'

export default {
  baseStats: {
    speed: '-40%',
    hpMax: '+100%',
    physPower: '+50%'
  },
  items: [{
    name: 'Sprout Saplings',
    abilities: {
      startOfCombat: {
        uses: 1,
        mods: [magicScalingMod],
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
                    'cancel'
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