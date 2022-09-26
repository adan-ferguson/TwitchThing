import { effectAction } from '../../actions.js'
import { all as Effects } from '../../effects/combined.js'

export default {
  baseStats: {
    speed: '+5%',
    hpMax: '+300%'
  },
  description: 'It\'s a giant bat. Look, just assume that all of the animals are giant, okay?',
  items: [
    {
      name: 'Fluttering',
      ability: {
        type: 'triggered',
        trigger: 'beforeAttacked',
        cooldown: 10000,
        name: 'dodge',
        actions: [
          effectAction(Effects.dodging, {
            effect: {
              duration: 0
            }
          })
        ]
      }
    }
  ]
}