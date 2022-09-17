import { attackAction } from '../../actions.js'

export default {
  ability: {
    type: 'active',
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
  orbs: 1,
  displayName: 'Sword With Display Name'
}