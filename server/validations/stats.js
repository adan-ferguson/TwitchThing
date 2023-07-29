import Stats from '../../game/stats/combined.js'
import Joi from 'joi'

const TYPES = {}
const MODIFIERS = {}

for(let key in Stats){
  TYPES[key] = Joi.any()
  MODIFIERS[key] = Joi.object({
    minValue: Joi.number(),
    maxValue: Joi.number(),
  })
}

export const STATS_SCHEMA = Joi.object(TYPES)
export const STATS_MODIFIERS_SCHEMA = Joi.object(MODIFIERS)
export const STATS_NAME_SCHEMA = Joi.string().valid(...Object.keys(Stats))