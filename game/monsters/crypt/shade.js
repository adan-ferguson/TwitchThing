// import { effectAction, timeAdjustmentAction } from '../../actions.js'
import { all as Effects } from '../../statusEffects/combined.js'
import statusEffect from '../../actions/generic/statusEffect.js'

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
      abilities: {
        takeDamage: {
          conditions: {
            hpPctBelow: 0.5
          },
          cooldown: 20000,
          actions: [statusEffect({
            affects: 'self',
            effect: {
              name: Effects.vanished.name,
              duration: 5000
            }
          })]
        }
      }
    }
  ]
}

