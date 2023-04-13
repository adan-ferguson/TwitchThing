import cancelAction from '../../actions/actionDefs/common/cancelAction.js'
import { roundToNearestIntervalOf } from '../../utilFunctions.js'

export default {
  levelFn: level => ({
    abilities: {
      attacked: {
        cooldown: roundToNearestIntervalOf(25000 * Math.pow(0.9, level - 1), 100),
        description: 'Automatically dodge an attack.',
        actions: [
          cancelAction({
            cancelReason: 'dodged'
          })
        ]
      }
    }
  }),
  orbs: 7,
  rarity: 1
}