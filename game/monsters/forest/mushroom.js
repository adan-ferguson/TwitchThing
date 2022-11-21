import { freezeActionBarMod, silencedMod } from '../../mods/combined.js'
import { poisonedStatusEffect } from '../../statusEffects/combined.js'
import randomAction from '../../actions/randomAction.js'
import statusEffect from '../../actions/statusEffectAction.js'
import gainHealthAction from '../../actions/gainHealthAction.js'

const burningSpores = statusEffect({
  base: poisonedStatusEffect,
  affects: 'enemy',
  effect: {
    displayName: 'Burning Spores',
    params: {
      damage: 0.03
    }
  }
})

const slowingSpores = statusEffect({
  affects: 'enemy',
  effect: {
    stacking: true,
    displayName: 'Slowing Spores',
    description: 'Slowed',
    duration: 15000,
    stats: {
      slow: 1000
    }
  }
})

const sleepSpores = statusEffect({
  affects: 'enemy',
  effect: {
    stacking: 'replace',
    displayName: 'Sleepy Spores',
    description: 'Zzzzz',
    mods: [freezeActionBarMod],
    duration: 5000
  }
})

const shrinkingSpores = statusEffect({
  affects: 'enemy',
  effect: {
    lingering: true,
    duration: 30000,
    description: 'Reduced stats.',
    stats: {
      physPower: '-20%',
      damageTaken: '+20%'
    },
    stacking: true,
    displayName: 'Shrinking Spores'
  }
})

const dizzySpores = statusEffect({
  affects: 'enemy',
  effect: {
    stacking: 'replace',
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
    stacking: 'replace',
    displayName: 'Silence Spores',
    duration: 30000,
    lingering: true,
    mods: [silencedMod]
  }
})

export default {
  baseStats: {
    hpMax: '+60%'
  },
  items: [
    {
      name: 'Passive',
      description: 'Can not perform any actions.',
      mods: [freezeActionBarMod]
    },
    {
      name: 'Regeneration',
      abilities: {
        tick: {
          initialCooldown: 5000,
          actions: [
            gainHealthAction({
              pct: 0.04
            })
          ]
        }
      }
    },
    {
      name: 'Weird Spores',
      abilities: {
        hitByAttack: {
          description: 'When attacked, release spores which give the attacker a random debuff.',
          actions: [
            randomAction([{
              weight: 30, value: burningSpores
            },{
              weight: 20, value: slowingSpores
            },{
              weight: 5, value: sleepSpores
            },{
              weight: 5, value: shrinkingSpores
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