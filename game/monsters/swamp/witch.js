import { magicAttackMod } from '../../mods/combined.js'
import randomAction from '../../actions/randomAction.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { dodgingStatusEffect } from '../../statusEffects/combined.js'

const hex = {
  duration: 30000,
  stackingId: 'hex',
  stacking: 'replace',
  persisting: true
}

const frogged = statusEffectAction({
  affects: 'enemy',
  effect: {
    ...hex,
    displayName: 'Hex: Frog',
    stats: {
      physPower: '-40%'
    }
  }
})

const catted = statusEffectAction({
  affects: 'enemy',
  effect: {
    ...hex,
    displayName: 'Hex: Cat',
    stats: {
      hpMax: '-40%',
      physPower: '-40%',
      speed: 50
    }
  }
})

const crowed = statusEffectAction({
  affects: 'enemy',
  effect: {
    ...hex,
    displayName: 'Hex: Crow',
    stats: {
      physPower: '-40%',
      hpMax: '-40%'
    },
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
})

const turtled = statusEffectAction({
  affects: 'enemy',
  effect: {
    ...hex,
    displayName: 'Hex: Turtle',
    stats: {
      physDef: '+40%',
      speed: -80
    },
  }
})

export default {
  baseStats: {
    hpMax: '-30%',
    speed: -30,
    magicPower: '+40%',
    magicDef: '+50%'
  },
  items: [
    {
      name: 'Magic Attack',
      mods: [magicAttackMod]
    },
    {
      name: 'Hex',
      abilities: {
        active: {
          description: 'Transform the enemy into a random critter for 30 seconds.',
          initialCooldown: 6000,
          uses: 1,
          actions: [
            randomAction([
              frogged,
              catted,
              crowed,
              turtled
            ])
          ]
        }
      }
    }
  ]
}