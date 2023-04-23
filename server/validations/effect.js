import { SUBJECT_KEYS } from './subjectKeys.js'
import Joi from 'joi'
import { STATS_SCHEMA } from './stats.js'

const TRIGGER_NAMES = ['physAttackHit','attacked']

const ACTION_SCHEMA = Joi.object({
  statusEffect: Joi.object({
    name: Joi.string().required(),
    vars: Joi.object()
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
  name: Joi.string().required(),
  actions: Joi.array().items(ACTION_SCHEMA),
  trigger: Joi.string().valid(...TRIGGER_NAMES).required()
}).xor('replacements', 'actions')

export const EFFECT_SCHEMA = Joi.object({
  abilities: Joi.array().items(ABILITY_SCHEMA),
  stats: STATS_SCHEMA
})