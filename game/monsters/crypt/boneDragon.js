import { bossMod, noBasicAttackMod } from '../../mods/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  baseStats: {
    physPower: '+90%',
    physDef: '+35%',
    speed: -40,
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