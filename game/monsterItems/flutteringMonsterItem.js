import statusEffectAction from '../actions/statusEffectAction.js'
import { dodgingStatusEffect } from '../statusEffects/combined.js'

export default {
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