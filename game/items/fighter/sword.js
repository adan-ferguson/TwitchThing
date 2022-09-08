import { attackAction } from '../../actions.js'

export default {
  active: {
    cooldown: 10000,
    actions: [
      attackAction({
        damageMulti: 1.5
      })
    ]
  },
  tags: 'weapon',
  orbs: 1
}