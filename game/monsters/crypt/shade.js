// import { effectAction, timeAdjustmentAction } from '../../actions.js'
import { all as Effects } from '../../statusEffects/combined.js'

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
          // effectAction(Effects.vanished, {
          //   effect: {
          //     duration: 5000
          //   }
          // })
        ]
      }
    }
  ]
}

