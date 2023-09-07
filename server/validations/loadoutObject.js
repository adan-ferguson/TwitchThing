import { SUBJECT_KEYS_SCHEMA } from './subjectKeys.js'
import { EFFECT_SCHEMA } from './effect.js'
import Joi from 'joi'
import { TAG_NAME_SCHEMA } from './tagNames.js'
import { STATS_NAME_SCHEMA } from './stats.js'
import { TRIGGER_NAME_SCHEMA } from './triggers.js'

const ORB_MODIFIER_SCHEMA = Joi.object({
  all: Joi.number().integer(),
  fighter: Joi.number().integer(),
  mage: Joi.number().integer(),
  paladin: Joi.number().integer(),
  rogue: Joi.number().integer(),
  chimera: Joi.number().integer(),
})

const RESTRICTION_SCHEMA = {
  empty: Joi.boolean(),
  slot: Joi.number().integer().min(1).max(8),
  hasAbility: TRIGGER_NAME_SCHEMA,
  hasStat: STATS_NAME_SCHEMA
}

const LOADOUT_MODIFIERS = Joi.array().items(Joi.object({
  subject: Joi.object({
    key: SUBJECT_KEYS_SCHEMA,
  }),
  conditions: Joi.object({
    hasTag: TAG_NAME_SCHEMA,
    hasAbility: TRIGGER_NAME_SCHEMA
  }),
  orbs: ORB_MODIFIER_SCHEMA,
  restrictions: RESTRICTION_SCHEMA,
  levelUp: Joi.number().integer(),
  loadoutModifierId: Joi.string()
}))

export const LOADOUT_OBJECT_SCHEMA = Joi.object({
  displayName: Joi.string(),
  loadoutModifiers: LOADOUT_MODIFIERS,
  vars: Joi.object(),
  effect: EFFECT_SCHEMA,
  maxLevel: Joi.number().integer().min(1)
})