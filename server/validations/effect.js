import { SUBJECT_KEYS } from './subjectKeys.js'
import Joi from 'joi'
import { STATS_SCHEMA } from './stats.js'
import { DAMAGE_TYPE_SCHEMA } from './damage.js'
import { STATICS_SCHEMA } from './statics.js'
import { status as StatusEffects, phantom as PhantomEffects } from '../../game/baseEffects/combined.js'
import _ from 'lodash'
import StatusEffectInstance from '../../game/baseEffects/statusEffectInstance.js'
import PhantomEffectInstance from '../../game/baseEffects/phantomEffectInstance.js'


const SCALED_NUMBER_SCHEMA = Joi.object({
  hpMax: Joi.number(),
  hpMissingPct: Joi.number(),
  hp: Joi.number(),
  magicPower: Joi.number(),
  physPower: Joi.number(),
  flat: Joi.number(),
  parentEffectParam: Joi.object()
})

const ACTION_SCHEMA = Joi.object({
  applyStatusEffect: Joi.object({
    affects: Joi.string().valid('self', 'enemy', 'target'),
    statusEffect: Joi.custom(val => {
      return Joi.attempt(val, STATUS_EFFECT_SCHEMA)
    }).required()
  }),
  attack: Joi.object({
    damageType: DAMAGE_TYPE_SCHEMA,
    scaling: SCALED_NUMBER_SCHEMA,
    range: Joi.array().length(2).items(Joi.number())
  }),
  gainHealth: Joi.object({
    scaling: SCALED_NUMBER_SCHEMA
  }),
  takeDamage: Joi.object({
    scaling: SCALED_NUMBER_SCHEMA,
    damageType: DAMAGE_TYPE_SCHEMA,
    ignoreDefense: Joi.bool().truthy(),
    ignoreOvertime: Joi.bool().truthy()
  })
})

const REPLACEMENT_SCHEMA = Joi.object({
  dataMerge: Joi.object({
    forceDodge: Joi.boolean()
  })
})

const TRIGGERS_SCHEMA = Joi.object({
  combatTime: Joi.number().integer(),
  attackHit: Joi.alternatives().try(
    Joi.object({
      damageType: DAMAGE_TYPE_SCHEMA
    }),
    Joi.bool().truthy()),
  active: Joi.bool().truthy(),
  attacked: Joi.bool().truthy(),
  instant: Joi.bool().truthy()
})

const ABILITY_SCHEMA = Joi.object({
  conditions: Joi.object({
    source: Joi.string().valid(...SUBJECT_KEYS),
    hpPctBelow: Joi.number()
  }),
  initialCooldown: Joi.number().integer(),
  cooldown: Joi.number().integer(),
  replacements: REPLACEMENT_SCHEMA,
  abilityId: Joi.string(),
  actions: Joi.array().items(ACTION_SCHEMA),
  uses: Joi.number().integer(),
  trigger: TRIGGERS_SCHEMA.required(),
  phantomEffect: Joi.custom(val => {
    return Joi.attempt(val, PHANTOM_EFFECT_SCHEMA)
  })
}).xor('replacements', 'actions')

export const EFFECT_SCHEMA = Joi.object({
  abilities: Joi.array().items(ABILITY_SCHEMA),
  stats: STATS_SCHEMA,
  conditions: Joi.object({
    deepestFloor: Joi.boolean()
  }),
  statics: STATICS_SCHEMA
})

export const STATUS_EFFECT_SCHEMA = EFFECT_SCHEMA.append({
  base: Joi.object({
    damageOverTime: SCALED_NUMBER_SCHEMA
  }),
  duration: Joi.number().integer(),
  stacking: Joi.string(),
  polarity: Joi.string().valid('buff','debuff','negativity'),
  name: Joi.string(),
  persisting: Joi.boolean().truthy()
})

export const PHANTOM_EFFECT_SCHEMA = EFFECT_SCHEMA.append({
  base: Joi.object({
    attackAppliesStatusEffect: STATUS_EFFECT_SCHEMA
  })
})

export function validateAllBaseEffects(){
  for(let id in StatusEffects){
    try {
      validateStatusEffect(id)
    }catch(ex){
      throw `StatusEffect "${id}" failed validation: ` + ex.message
    }
  }
  for(let id in PhantomEffects){
    try {
      validatePhantomEffect(id)
    }catch(ex){
      throw `PhantomEffect "${id}" failed validation: ` + ex.message
    }
  }
}

function validateStatusEffect(id){
  const sei = new StatusEffectInstance({ base: { [id]: undefined } }, {})
  Joi.assert(sei.effectData, STATUS_EFFECT_SCHEMA)
}

function validatePhantomEffect(id){
  const pei = new PhantomEffectInstance({ base: { [id]: undefined } }, {})
  Joi.assert(pei.effectData, EFFECT_SCHEMA)
}