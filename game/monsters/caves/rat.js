import { all as Effects } from '../../statusEffects/combined.js'

export default {
  baseStats: {
    speed: '+5%'
  },
  description: 'A large rat, not just a regular one, I mean come on.',
  items: [
    {
      name: 'Diseased',
      ability: {
        type: 'triggered',
        trigger: 'attackHit',
        chance: 0.75,
        actions: [
          // effectAction(Effects.diseased, {
          //   affects: 'enemy'
          // })
        ]
      }
    }
  ]
}