import { all as Effects } from '../../statusEffects/combined.js'

export default {
  description: 'It moves like it\'s stop-motion animated.',
  items: [
    {
      name: 'Web Shot',
      ability: {
        type: 'active',
        cooldown: 9000,
        actions: [
          // effectAction(Effects.webbed, {
          //   affects: 'enemy'
          // })
        ]
      }
    }
  ]
}