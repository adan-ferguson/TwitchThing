import { SUBJECT_KEYS } from './subjectKeys.js'
import Joi from 'joi'
import { keyedObject } from '../../game/utilFunctions.js'
import { STATS_SCHEMA } from './stats.js'

const ABILITY_KEYS = ['physAttackHit']

const ACTION_SCHEMA = Joi.object({
  statusEffect: Joi.object({
    name: Joi.string().required(),
    vars: Joi.object()
  })
})

const ABILITY_SCHEMA = Joi.object({
  actions: Joi.array().items(ACTION_SCHEMA),
  conditions: Joi.object({
    source: Joi.string().valid(...SUBJECT_KEYS)
  })
})

const ABILITIES_SCHEMA = Joi.object(keyedObject(ABILITY_KEYS, ABILITY_SCHEMA))

export const ADVENTURER_EFFECT_SCHEMA = Joi.object({
  abilities: ABILITIES_SCHEMA,
  stats: STATS_SCHEMA
})