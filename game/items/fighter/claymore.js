import { attackAction } from '../../actions.js'
import { all as Effects } from '../../statusEffects/combined.js'

export default {
  ability: {
    type: 'active',
    cooldown: 12000,
    actions: [
      attackAction(), {
        type: 'statusEffect',
        affects: 'enemy',
        effect: {
          name: Effects.stunned.name,
          duration: 2000
        }
      }
    ]
  },
  stats: {
    physPower: '+20%'
  },
  tags: 'weapon',
  orbs: 2,
}