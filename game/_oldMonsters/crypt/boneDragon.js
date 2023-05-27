import { bossMod, noBasicAttackMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'

export default {
  baseStats: {
    physPower: '+120%',
    physDef: '+30%',
    speed: -30,
    hpMax: '+110%'
  },
  items: [
    {
      name: 'Boss',
      mods: [bossMod]
    },
    {
      name: 'Screech',
      abilities: {
        active: {
          cooldown: 30000,
          description: 'Fears the enemy, stopping them from basic attacking for 15 seconds.',
          actions: [
            statusEffectAction({
              target: 'enemy',
              effect: {
                duration: 15000,
                description: 'Can\'t basic attack',
                mods: [noBasicAttackMod],
                displayName: 'Terror'
              }
            })
          ]
        }
      }
    }
  ]
}