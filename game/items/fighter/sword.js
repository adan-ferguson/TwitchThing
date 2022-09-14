import { attackAction } from '../../actions.js'

export default {
  active: {
    displayName: 'Slash',
    cooldown: 10000,
    actions: [
      attackAction({
        damageMulti: 1.5
      })
    ]
  },
  stats: {
    physPower: '+10%'
  },
  description: 'This is a generic sword for testing.',
  tags: 'weapon',
  orbs: 1
}