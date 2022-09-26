import { attackAction, effectAction } from '../../actions.js'
import { all as Effects } from '../../effects/combined.js'

export default {
  ability: {
    type: 'active',
    cooldown: 12000,
    actions: [
      attackAction(),
      effectAction(Effects.stunned, {
        affects: 'enemy',
        effect: {
          duration: 2000
        }
      })
    ]
  },
  stats: {
    physPower: '+20%'
  },
  tags: 'weapon',
  orbs: 2,
}