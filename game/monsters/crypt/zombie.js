import { effectAction } from '../../actions.js'
import { all as Effects } from '../../effects/combined.js'

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
        chance: 0.25,
        actions: [
          effectAction(Effects.diseased, {
            affects: 'enemy'
          })
        ]
      }
    }
  ]
}