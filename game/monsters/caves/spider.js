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
          effectAction({
            effect: {
              // TODO: make this sharable somehow
              id: 'spiderweb',
              displayName: 'Webbed',
              stacking: true,
              duration: 'combat',
              stats: {
                slow: 0.2
              }
            },
            affects: 'enemy'
          })
        ]
      }
    }
  ]
}