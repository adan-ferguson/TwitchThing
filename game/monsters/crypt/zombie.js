import { all as Effects } from '../../statusEffects/combined.js'

export default {
  baseStats: {
    hpMax: '+60%',
    speed: '-30%'
  },
  items: [
    {
      name: 'Diseased',
      ability: {
        type: 'triggered',
        trigger: 'attackHit',
        chance: 0.25,
        actions: [
          // effectAction(Effects.diseased, {
          //   affects: 'enemy'
          // })
        ]
      }
    }
  ]
}