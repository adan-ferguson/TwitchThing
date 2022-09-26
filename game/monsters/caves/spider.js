import { effectAction } from '../../actions.js'
import { all as Effects } from '../../effects/combined.js'

export default {
  description: 'It moves like it\'s stop-motion animated.',
  items: [
    {
      name: 'Web Shot',
      ability: {
        type: 'active',
        cooldown: 9000,
        actions: [
          effectAction(Effects.webbed, {
            affects: 'enemy'
          })
        ]
      }
    }
  ]
}