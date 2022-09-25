import { effectAction } from '../../actions.js'
import { diseased } from '../../effects/generic/diseased.js'

export default {
  baseStats: {
    hpMax: '+60%',
    speed: '-30%'
  },
  items: [
    {
      name: 'Diseased',
      ability: {
        type: 'triggered',
        trigger: 'onAttack',
        chance: 0.3,
        actions: [
          effectAction({
            effect: diseased(),
            affects: 'enemy'
          })
        ]
      }
    }
  ]
}