import { effectAction } from '../../actions.js'

export default {
  description: 'It moves like it\'s stop-motion animated.',
  items: [
    {
      name: 'Web Shot',
      ability: {
        type: 'active',
        cooldown: 9000,
        actions: [
          effectAction(
            {
              type: 'slow',
              amount: 0.2,
              duration: 'combat'
            },
            {
              affects: 'enemy'
            }
          )
        ]
      }
    }
  ]
}