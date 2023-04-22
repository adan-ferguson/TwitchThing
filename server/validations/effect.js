import { SUBJECT_KEYS } from './subjectKeys.js'
import Joi from 'joi'
import { keyedObject } from '../../game/utilFunctions.js'
import { STATS_SCHEMA } from './stats.js'

const ABILITY_KEYS = ['physAttackHit','attacked']

const ACTION_SCHEMA = Joi.object({
  statusEffect: Joi.object({
    name: Joi.string().required(),
    vars: Joi.object()
  })
})

const ABILITY_OBJ = {
  conditions: Joi.object({
    source: Joi.string().valid(...SUBJECT_KEYS)
  }),
  cooldown: Joi.number().integer(),
}

const TRIGGER_SCHEMA = Joi.object({
  ...ABILITY_OBJ,
  actions: Joi.array().items(ACTION_SCHEMA)
})

const REPLACEMENT_SCHEMA = Joi.object({
  ...ABILITY_OBJ,
  dataMerge: Joi.object({
    forceDodge: Joi.boolean()
  })
})

const TRIGGERS_SCHEMA = Joi.object(keyedObject(ABILITY_KEYS, TRIGGER_SCHEMA))
const REPLACEMENTS_SCHEMA = Joi.object(keyedObject(ABILITY_KEYS, REPLACEMENT_SCHEMA))

export const EFFECT_SCHEMA = Joi.object({
  abilities: Joi.object({
    replacement: REPLACEMENTS_SCHEMA,
    triggered: TRIGGERS_SCHEMA
  }),
  stats: STATS_SCHEMA
})