import flutteringMonsterItem from '../../monsterItems/flutteringMonsterItem.js'
import { magicScalingMod } from '../../mods/combined.js'
import attackAction from '../../actions/attackAction.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  baseStats: {
    magicDef: '+30%',
    speed: 20,
    physPower: '+10%',
    magicPower: '+10%',
    hpMax: '+10%'
  },
  items: [
    flutteringMonsterItem,
    {
      name: 'Acid Breath',
      mods: [magicScalingMod],
      abilities: {
        active: {
          initialCooldown: 15000,
          description: '{A0} Destroys 50% of target\'s armor.',
          actions: [
            attackAction({
              damageType: 'magic'
            }),
            statusEffectAction({
              affects: 'enemy',
              effect: {
                displayName: 'Acidified',
                persisting: true,
                stacking: true,
                description: 'Magic and phys defense reduced by half.',
                duration: 60000,
                stats: {
                  physDef: '-50%',
                  magicDef: '-50%'
                }
              }
            })
          ]
        }
      },
    }
  ]
}