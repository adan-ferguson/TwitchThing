import { freezeActionBarMod, silencedMod } from '../../mods/combined.js'
import { poisonedStatusEffect } from '../../statusEffects/combined.js'
import randomAction from '../../actions/actionDefs/common/randomAction.js'
import statusEffect from '../../actions/actionDefs/common/statusEffectAction.js'
import gainHealthAction from '../../actions/actionDefs/common/gainHealthAction.js'

const burningSpores = statusEffect({
  base: poisonedStatusEffect,
  affects: 'enemy',
  effect: {
    displayName: 'Burning Spores',
    duration: 10000,
    persisting: true,
    params: {
      damage: 0.05
    }
  }
})

const slowingSpores = statusEffect({
  affects: 'enemy',
  effect: {
    stacking: true,
    displayName: 'Slowing Spores',
    description: 'Slowed',
    persisting: true,
    duration: 10000,
    stats: {
      speed: -25
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
    persisting: true,
    duration: 10000,
    description: 'Reduced phys power & max health.',
    stats: {
      physPower: '-20%',
      hpMax: '-20%'
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
    persisting: true,
    description: '33% chance to miss attacks.',
    stats: {
      missChance: '33%'
    }
  }
})

const silenceSpores = statusEffect({
  affects: 'enemy',
  effect: {
    stacking: 'replace',
    displayName: 'Silence Spores',
    duration: 10000,
    persisting: true,
    description: 'Can only do basic attacks.',
    mods: [silencedMod]
  }
})

export default {
  baseStats: {
    hpMax: '+80%',
    physPower: '-50%',
    magicPower: '+20%'
  },
  items: [
    {
      name: 'Passive',
      description: 'Action bar does not fill.',
      mods: [freezeActionBarMod]
    },
    {
      name: 'Regeneration',
      abilities: {
        tick: {
          cooldown: 5000,
          actions: [
            gainHealthAction({
              scaling: { magicPower: 0.2 }
            })
          ]
        }
      }
    },
    {
      name: 'Spores',
      abilities: {
        hitByAttack: {
          description: 'When attacked, release spores which give the attacker a random debuff.',
          actions: [
            randomAction([{
              weight: 25, value: burningSpores
            },{
              weight: 10, value: slowingSpores
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