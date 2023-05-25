import Joi from 'joi'
import { EFFECT_SCHEMA } from './effect.js'

export const MONSTER_ITEM_SCHEMA = Joi.object({
  name: Joi.string(),
  effect: EFFECT_SCHEMA.append({
    rewards: Joi.object({
      food: Joi.number().integer()
    })
  })
})
