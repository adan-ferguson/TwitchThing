import Joi from 'joi'

export const POLARITY_SCHEMA = Joi.string().valid('buff','debuff')