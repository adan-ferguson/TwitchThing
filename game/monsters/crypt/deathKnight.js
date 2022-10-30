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
          description: 'Deal [P1.2] phys damage. 1/3 chance to inflict curse.',
          actions: [
            attackAction({
              damageMulti: 1.2
            }),
            maybeAction({
              chance: 1/3
            }),
            statusEffectAction({
              affects: 'enemy',
              combatOnly: false,
              effect: {
                displayName: 'Cursed',
                stacking: true,
                stats: {
                  enemyCritChance: '+10%'
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