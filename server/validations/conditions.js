import Joi from 'joi'
import { SUBJECT_KEYS_SCHEMA } from './subjectKeys.js'
import { TAG_NAME_SCHEMA } from './tagNames.js'
import { DAMAGE_TYPE_SCHEMA } from './damage.js'

export const FIGHTER_INSTANCE_CONDITIONS_SCHEMA = Joi.object({
  hpPctBelow: Joi.number(),   // Is our hpPct below this number?
  deepestFloor: Joi.bool(),   // Are we on the adventurer's deepest floor?
  bossFight: Joi.bool(),
  hasStatusEffectWithName: Joi.string(),
  doesntHaveStatusEffectWithName: Joi.string(),
  hasDebuff: Joi.bool()
})

export const ABILITY_CONDITIONS_SCHEMA = Joi.object({
  source: Joi.object({
    subjectKey: SUBJECT_KEYS_SCHEMA,
    hasTag: TAG_NAME_SCHEMA
  }),
  data: Joi.object({
    damageType: DAMAGE_TYPE_SCHEMA,
    undodgeable: Joi.bool() // Are we being attacked by a dodgeable attack?
  }),
  owner: FIGHTER_INSTANCE_CONDITIONS_SCHEMA,
  random: Joi.number().min(0).max(1)
  // combat: Joi.object({
  //   bossFight: Joi.bool(),      // Are we in a boss fight?
  // })
})