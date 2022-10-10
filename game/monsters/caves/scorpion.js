import { all as Effects } from '../../statusEffects/combined.js'
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
              affects: 'enemy',
              effect: {
                name: Effects.poisoned.name,
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