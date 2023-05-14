import Joi from 'joi'

export const STATICS_SCHEMA = Joi.array().items(
  Joi.object({
    sneakAttack: Joi.boolean().truthy()
  })
)