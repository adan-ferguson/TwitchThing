import statusEffectAction from '../../actions/statusEffectAction.js'
import { barrierStatusEffect } from '../../statusEffects/combined.js'
import { magicScalingMod } from '../../mods/combined.js'

export default {
  baseStats: {
    speed: '-50%',
    hpMax: '+50%'
  },
  items: [{
    name: 'Sprout Saplings',
    abilities: {
      startOfCombat: {
        uses: 1,
        mods: [magicScalingMod],
        description: 'Summon 3 saplings which each block an ability.',
        actions: Array(3).fill(
          statusEffectAction({
            effect: {
              stacking: true,
              displayName: 'Sapling',
              description: 'Blocks an ability',

            }
          })
        )
      }
    }
  }]
}