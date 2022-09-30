import { all as Effects } from '../../statusEffects/combined.js'

export default {
  baseStats: {
    hpMax: '+50%',
    speed: '-30%'
  },
  items: [
    {
      name: 'Poison Sting',
      ability: {
        type: 'triggered',
        trigger: 'attackHit',
        actions: [
          {
            type: 'statusEffect',
            affects: 'enemy',
            effect: {
              name: Effects.poisoned.name,
              duration: 10000,
              params: {
                damage: 1.2
              }
            }
          }
        ]
      }
    }
  ]
}