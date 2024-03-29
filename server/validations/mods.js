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
    noAttack: Joi.boolean().truthy(),
    noBasicAttack: Joi.boolean().truthy(),
    preventGainStatusEffect: Joi.string().valid('buff','debuff'),
    cantDie: Joi.boolean(),
    magicCrit: Joi.bool(),
    goldOnly: Joi.bool(),
    glitchedCooldowns: Joi.bool(),
    stayHungry: Joi.bool(),
  })
)