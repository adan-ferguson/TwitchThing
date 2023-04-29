import { SUBJECT_KEYS } from './subjectKeys.js'
import Joi from 'joi'
import { STATS_SCHEMA } from './stats.js'

const TRIGGER_NAMES = ['active','physAttackHit','attacked']

const SCALED_NUMBER_SCHEMA = Joi.object({
  hpMax: Joi.number(),
  hpMissingPct: Joi.number(),
  hp: Joi.number(),
  magicPower: Joi.number(),
  physPower: Joi.number(),
  flat: Joi.number()
})

const ACTION_SCHEMA = Joi.object({
  statusEffect: Joi.object({
    actionId: Joi.string(),
    vars: Joi.object()
  }),
  attack: Joi.object({
    damageType: Joi.string().valid('phys', 'magic'),
    scaling: SCALED_NUMBER_SCHEMA,
  })
})

const REPLACEMENT_SCHEMA = Joi.object({
  dataMerge: Joi.object({
    forceDodge: Joi.boolean()
  })
})

const ABILITY_SCHEMA = Joi.object({
  conditions: Joi.object({
    source: Joi.string().valid(...SUBJECT_KEYS)
  }),
  cooldown: Joi.number().integer(),
  replacements: REPLACEMENT_SCHEMA,
  abilityId: Joi.string(),
  actions: Joi.array().items(ACTION_SCHEMA),
  trigger: Joi.string().valid(...TRIGGER_NAMES).required()
}).xor('replacements', 'actions')

export const EFFECT_SCHEMA = Joi.object({
  abilities: Joi.array().items(ABILITY_SCHEMA),
  stats: STATS_SCHEMA
})