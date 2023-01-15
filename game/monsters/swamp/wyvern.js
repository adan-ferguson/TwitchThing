import flutteringMonsterItem from '../../monsterItems/flutteringMonsterItem.js'
import { magicScalingMod } from '../../mods/combined.js'
import attackAction from '../../actions/attackAction.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  baseStats: {
    magicDef: '+30%',
    speed: 10,
    magicPower: '+50%'
  },
  items: [
    flutteringMonsterItem,
    {
      name: 'Acid Breath',
      mods: [magicScalingMod],
      abilities: {
        active: {
          initialCooldown: 15000,
          uses: 1,
          actions: [
            attackAction({
              damageType: 'magic'
            }),
            statusEffectAction({
              affects: 'enemy',
              effect: {
                displayName: 'Acidified',
                persisting: true,
                stats: {
                  physDef: '-50%'
                }
              }
            })
          ]
        }
      },
    }
  ]
}