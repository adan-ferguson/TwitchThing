import { effectAction, timeAdjustmentAction } from '../../actions.js'
import { vanishEffect } from '../../effects/generic/vanish.js'

export default {
  baseStats: {
    speed: '+50%',
    physPower: '-30%',
    hpMax: '-30%'
  },
  description: 'Very fast!',
  items: [
    {
      name: 'Vanish',
      ability: {
        type: 'active',
        conditions: {
          hpPctBelow: 0.5
        },
        uses: 1,
        actions: [
          effectAction({
            effect: vanishEffect()
          }),
          timeAdjustmentAction(-5000)
        ]
      }
    }
  ]
}

