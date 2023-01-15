import attackAction from '../../actions/attackAction.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import maybeAction from '../../actions/maybeAction.js'

export default {
  baseStats: {
    physPower: '-10%',
  },
  items: [
    {
      name: 'Cursed Strike',
      abilities: {
        active: {
          cooldown: 8000,
          description: 'Deal [physScaling1.2] phys damage. 1/3 chance to inflict a curse, making it more likely like the target will be crit.',
          actions: [
            attackAction({
              damageMulti: 1.2
            }),
            maybeAction({
              chance: 1 //1/3
            }),
            statusEffectAction({
              affects: 'enemy',
              effect: {
                displayName: 'Cursed',
                stacking: true,
                persisting: true,
                stats: {
                  enemyCritChance: '+20%'
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