import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'
import { dodgingStatusEffect } from '../../statusEffects/combined.js'
import attackAction from '../../actions/actionDefs/common/attack.js'
import { magicScalingMod } from '../../mods/combined.js'
import flutteringMonsterItem from '../../monsterItems/flutteringMonsterItem.js'

export default {
  baseStats: {
    speed: 50,
    hpMax: '-50%',
    physPower: '-40%',
    magicPower: '+40%'
  },
  items: [
    flutteringMonsterItem,
    {
      name: 'Magic Blast',
      abilities: {
        active: {
          initialCooldown: 7500,
          actions: [
            attackAction({
              damageType: 'magic'
            })
          ]
        }
      },
      mods: [magicScalingMod]
    }
  ]
}