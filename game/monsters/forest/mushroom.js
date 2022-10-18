import { freezeActionBarMod, silencedMod } from '../../mods/combined.js'
import { poisonedStatusEffect, starvingStatusEffect } from '../../statusEffects/combined.js'
import randomAction from '../../actions/randomAction.js'
import statusEffect from '../../actions/statusEffectAction.js'
import gainHealthAction from '../../actions/gainHealthAction.js'

const burningSpores = statusEffect({
  base: poisonedStatusEffect,
  affects: 'enemy',
  effect: {
    displayName: 'Burning Spores',
    params: {
      damage: 0.02
    }
  }
})

const slowingSpores = statusEffect({
  affects: 'enemy',
  effect: {
    stacking: true,
    displayName: 'Slowing Spores',
    stats: {
      slow: 1000
    }
  }
})

const sleepSpores = statusEffect({
  affects: 'enemy',
  effect: {
    stacking: 'refresh',
    displayName: 'Sleepy Spores',
    mods: [freezeActionBarMod],
    duration: 5000
  }
})

const starvingSpores = statusEffect({
  affects: 'enemy',
  base: starvingStatusEffect,
  effect: {
    stacking: true,
    displayName: 'Hunger Spores'
  }
})

const dizzySpores = statusEffect({
  affects: 'enemy',
  effect: {
    stacking: 'refresh',
    displayName: 'Dizzy Spores',
    duration: 10000,
    stats: {
      missChance: '50%'
    }
  }
})

const silenceSpores = statusEffect({
  affects: 'enemy',
  effect: {
    stacking: 'refresh',
    displayName: 'Silence Spores',
    duration: 10000,
    mods: [silencedMod]
  }
})

export default {
  baseStats: {
    hpMax: '+50%'
  },
  items: [
    {
      name: 'Passive',
      description: 'Can not perform actions',
      mods: [freezeActionBarMod]
    },
    {
      name: 'Regeneration',
      abilities: {
        tick: {
          cooldown: 5000,
          actions: [
            gainHealthAction({
              pct: 0.02
            })
          ]
        }
      }
    },
    {
      name: 'Weird Spores',
      abilities: {
        hitByAttack: {
          actions: [
            randomAction([{
              weight: 30, value: burningSpores
            },{
              weight: 20, value: slowingSpores
            },{
              weight: 5, value: sleepSpores
            },{
              weight: 5, value: starvingSpores
            },{
              weight: 10, value: dizzySpores
            },{
              weight: 10, value: silenceSpores
            }])
          ]
        }
      }
    }
  ]
}