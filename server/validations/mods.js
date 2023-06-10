import Joi from 'joi'

export const MODS_SCHEMA = Joi.array().items(
  Joi.object({
    sneakAttack: Joi.boolean(),
    ignoreDef: Joi.string().valid('phys', 'magic', 'all'),
    bossFightStatMultiplier: Joi.number(),
    autoCritAgainst: Joi.boolean(),
    freezeActionBar: Joi.boolean(),
    silenced: Joi.boolean().truthy(),
    magicAttack: Joi.boolean().truthy(),
    disabled: Joi.boolean().truthy(),
    noBasicAttack: Joi.boolean().truthy(),
    preventGainStatusEffect: Joi.string().valid('buff','debuff'),
  })
)