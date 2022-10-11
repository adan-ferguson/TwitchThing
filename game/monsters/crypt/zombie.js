import statusEffect from '../../actions/generic/statusEffect.js'
import { diseasedStatusEffect } from '../../statusEffects/combined.js'

export default {
  baseStats: {
    hpMax: '+260%',
    speed: '-30%'
  },
  items: [
    {
      name: 'Diseased',
      abilities: {
        attackHit: {
          chance: 0.8,
          actions: [
            statusEffect({
              base: diseasedStatusEffect,
              affects: 'enemy'
            })
          ]
        }
      }
    }
  ]
}