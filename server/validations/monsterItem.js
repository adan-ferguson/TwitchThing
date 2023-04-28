import Joi from 'joi'
import { EFFECT_SCHEMA } from './effect.js'

export const MONSTER_ITEM_SCHEMA = Joi.object({
  name: Joi.string().required(),
  effect: EFFECT_SCHEMA
})