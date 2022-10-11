import { all as Effects, poisonedStatusEffect } from '../../statusEffects/combined.js'
import statusEffect from '../../actions/generic/statusEffect.js'

export default {
  baseStats: {
    hpMax: '+500%',
    speed: '-30%'
  },
  items: [
    {
      name: 'Poison Sting',
      abilities: {
        attackHit: {
          actions: [
            statusEffect({
              base: poisonedStatusEffect,
              affects: 'enemy',
              effect: {
                duration: 30000,
                params: {
                  damage: 0.1
                }
              }
            })
          ]
        }
      }
    }
  ]
}