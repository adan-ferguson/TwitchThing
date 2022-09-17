import { attackAction } from '../../actions.js'

export default {
  description: 'Like a small lizard person.',
  items: [
    {
      name: 'Quick Attack',
      ability: {
        type: 'active',
        cooldown: 10000,
        turnTime: 0.5,
        actions: [
          attackAction({
            damageMulti: 0.8
          })
        ]
      }
    },
    {
      name: 'Heavy Attack',
      ability: {
        type: 'active',
        cooldown: 10000,
        turnTime: 1.5,
        actions: [
          attackAction({
            damageMulti: 1.6
          })
        ]
      },
    }
  ]
}