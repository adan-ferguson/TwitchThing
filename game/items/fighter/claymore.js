import { attackAction, effectAction } from '../../actions.js'
import { stunEffect } from '../../effects/stun.js'

export default {
  ability: {
    type: 'active',
    cooldown: 12000,
    actions: [
      attackAction(),
      effectAction({
        affects: 'enemy',
        effect: stunEffect(2000)
      })
    ]
  },
  stats: {
    physPower: '+20%'
  },
  tags: 'weapon',
  orbs: 2,
}