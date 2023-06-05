import Stats from '../../game/stats/combined.js'
import Joi from 'joi'

const TYPES = {}

for(let key in Stats){
  TYPES[key] = Joi.any()
}

export const STATS_SCHEMA = Joi.object(TYPES)
export const STATS_NAME_SCHEMA = Joi.string().valid(...Object.keys(Stats))