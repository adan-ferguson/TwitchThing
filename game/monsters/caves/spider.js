import { effectAction } from '../../actions.js'
import { webbedEffect } from '../../effects/webbed.js'

export default {
  description: 'It moves like it\'s stop-motion animated.',
  items: [
    {
      name: 'Web Shot',
      ability: {
        type: 'active',
        cooldown: 9000,
        actions: [
          effectAction({
            effect: webbedEffect(),
            affects: 'enemy'
          })
        ]
      }
    }
  ]
}