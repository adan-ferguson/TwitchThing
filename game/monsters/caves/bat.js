import { dodgingStatusEffect } from '../../statusEffects/combined.js'
import statusEffectAction from '../../actions/statusEffectAction.js'

export default {
  baseStats: {
    speed: '+10%',
    hpMax: '-10%',
    physPower: '-10%'
  },
  description: 'It\'s a giant bat. Look, just assume that all of the animals are giant, okay?',
  items: [
    {
      name: 'Fluttering',
      abilities: {
        targeted: {
          cooldown: 10000,
          description: 'Automatically dodge an attack.',
          actions: [
            statusEffectAction({
              base: dodgingStatusEffect,
              effect: {
                duration: 0
              }
            })
          ]
        }
      }
    }
  ]
}