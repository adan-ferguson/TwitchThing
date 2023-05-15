import Joi from 'joi'

export const MODS_SCHEMA = Joi.array().items(
  Joi.object({
    sneakAttack: Joi.boolean().truthy()
  })
)