import { magicAttackMod } from '../../mods/combined.js'
import randomAction from '../../actions/randomAction.js'
import statusEffectAction from '../../actions/statusEffectAction.js'
import { dodgingStatusEffect } from '../../statusEffects/combined.js'

const hex = {
  duration: 60000,
  stackingId: 'hex',
  stacking: 'replace'
}
const frogged = statusEffectAction({
  affects: 'enemy',
  effect: {
    ...hex,
    displayName: 'Hex: Frog',
    stats: {
      hpMax: '-30%',
      physPower: '-30%'
    }
  }
})

const catted = statusEffectAction({
  affects: 'enemy',
  effect: {
    ...hex,
    displayName: 'Hex: Cat',
    stats: {
      hpMax: '-30%',
      physPower: '-30%',
      speed: '+30%'
    }
  }
})

const crowed = statusEffectAction({
  affects: 'enemy',
  effect: {
    ...hex,
    displayName: 'Hex: Crow',
    stats: {
      physPower: '-30%',
      hpMax: '-30%'
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
      physDef: '+30%',
      speed: '-30%'
    },
  }
})

export default {
  baseStats: {
    hpMax: '-50%',
    speed: -15,
    magicPower: '+30%',
    magicDef: '+60%'
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
          description: 'Transform the enemy into a random critter for 60 seconds.',
          initialCooldown: 10000,
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