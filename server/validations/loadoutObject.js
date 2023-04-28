import { SUBJECT_KEYS } from './subjectKeys.js'
import { EFFECT_SCHEMA } from './effect.js'
import Joi from 'joi'

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
  slot: Joi.number().integer().min(1).max(8)
}

const LOADOUT_MODIFIERS = {}
SUBJECT_KEYS.forEach(sk => {
  LOADOUT_MODIFIERS[sk] = Joi.object({
    orbs: ORB_MODIFIER_SCHEMA,
    restrictions: RESTRICTION_SCHEMA
  })
})

export const LOADOUT_OBJECT_SCHEMA = Joi.object({
  displayName: Joi.string().required(),
  loadoutModifiers: Joi.object(LOADOUT_MODIFIERS),
  vars: Joi.object(),
  effect: EFFECT_SCHEMA,
})