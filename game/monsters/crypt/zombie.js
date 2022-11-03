import statusEffect from '../../actions/statusEffectAction.js'
import { diseasedStatusEffect } from '../../statusEffects/combined.js'

export default {
  baseStats: {
    hpMax: '+60%',
    speed: -60
  },
  items: [
    {
      name: 'Diseased',
      abilities: {
        attackHit: {
          chance: 0.2,
          description: 'Attacks have 20% chance to disease the enemy.',
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