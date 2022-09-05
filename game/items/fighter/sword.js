import { attackAction } from '../../actions.js'

export default {
  active: {
    cooldown: 10,
    actions: [
      attackAction({
        damageMulti: 1.5
      })
    ]
  },
  tags: 'weapon',
  orbs: 1
}