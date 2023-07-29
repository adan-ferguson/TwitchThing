import Joi from 'joi'

export const DAMAGE_TYPE_SCHEMA = Joi.string().valid('phys', 'magic')