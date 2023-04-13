import attackAction from '../../actions/actionDefs/common/attack.js'
import statusEffectAction from '../../actions/actionDefs/common/statusEffectAction.js'

export default {
  baseStats: {
    physPower: '-10%',
    physDef: '+30%',
    speed: -20,
    hpMax: '+30%'
  },
  items: [
    {
      name: 'Cursed Strike',
      abilities: {
        active: {
          cooldown: 8000,
          description: 'Deal [physScaling1.2] phys damage. Inflicts a curse (more chance to be crit).',
          actions: [
            attackAction({
              damageMulti: 1.2
            }),
            statusEffectAction({
              affects: 'enemy',
              effect: {
                displayName: 'Cursed',
                stacking: true,
                persisting: true,
                duration: 30000,
                stats: {
                  enemyCritChance: 0.1
                }
              }
            })
          ]
        }
      }
    },
    {
      name: 'Deadly Blade',
      stats: {
        critDamage: '+100%'
      }
    }
  ]
}