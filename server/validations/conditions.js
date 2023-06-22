import Joi from 'joi'
import { SUBJECT_KEYS_SCHEMA } from './subjectKeys.js'
import { TAG_NAME_SCHEMA } from './tagNames.js'
import { DAMAGE_TYPE_SCHEMA } from './damage.js'
import { TRIGGER_NAME_SCHEMA } from './triggers.js'

export const FIGHTER_INSTANCE_CONDITIONS_SCHEMA = Joi.object({
  hpFull: Joi.bool(),
  hpPctBelow: Joi.number(),   // Is our hpPct below this number?
  deepestFloor: Joi.bool(),   // Are we on the adventurer's deepest floor?
  bossFight: Joi.bool(),
  hasStatusEffectWithName: Joi.string(),
  doesntHaveStatusEffectWithName: Joi.string(),
  hasDebuff: Joi.bool(),
  overtime: Joi.bool().truthy()
})

export const ABILITY_CONDITIONS_SCHEMA = Joi.object({
  source: Joi.object({
    subjectKey: SUBJECT_KEYS_SCHEMA,
    hasTag: TAG_NAME_SCHEMA,
    trigger: TRIGGER_NAME_SCHEMA
  }),
  data: Joi.object({
    damageType: DAMAGE_TYPE_SCHEMA,
    cantDodge: Joi.bool(),
    isAttack: Joi.bool(),
  }),
  owner: FIGHTER_INSTANCE_CONDITIONS_SCHEMA,
  random: Joi.number().min(0).max(1),
})