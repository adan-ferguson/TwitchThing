import { bossMod, noBasicAttackMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  baseStats: {
    physPower: '+90%',
    physDef: '+30%',
    speed: -25,
    hpMax: '+70%'
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
          actions: [
            statusEffectAction({
              affects: 'enemy',
              effect: {
                duration: 10000,
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