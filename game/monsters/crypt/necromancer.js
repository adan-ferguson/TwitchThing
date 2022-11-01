import { magicAttackMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import attackAction from '../../actions/attackAction.js'

export default {
  baseStats: {
    hpMax: '+10%',
    speed: '-20%',
    physPower: '-50%',
    magicPower: '-10%'
  },
  items: [
    {
      name: 'Magic Attack',
      mods: [magicAttackMod]
    },
    {
      name: 'Skeleton Archer',
      abilities: {
        active: {
          cooldown: 6000,
          description: 'Summons a skeleton archer to shoot the opponent. Shoots every 3 seconds for [magicScaling0.4] phys damage.',
          actions: [
            statusEffectAction({
              effect: {
                stacking: false,
                displayName: 'Skeleton Archer',
                description: 'It\'s in the background so you can\'t hit it. (Not a cop-out or anything)',
                isBuff: true,
                abilities: {
                  tick: {
                    initialCooldown: 3000,
                    actions: [
                      attackAction({
                        damageType: 'phys',
                        damageScaling: 'magic',
                        damageMulti: 0.5
                      })
                    ]
                  }
                }
              }
            })
          ]
        }
      }
    }
  ]
}