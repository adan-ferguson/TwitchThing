import { SUBJECT_KEYS } from './subjectKeys.js'
import Joi from 'joi'
import { STATS_SCHEMA } from './stats.js'
import { DAMAGE_TYPE_SCHEMA } from './damage.js'
import { STATICS_SCHEMA } from './statics.js'
import StatusEffects from '../../game/statusEffects/combined.js'
import _ from 'lodash'


const SCALED_NUMBER_SCHEMA = Joi.object({
  hpMax: Joi.number(),
  hpMissingPct: Joi.number(),
  hp: Joi.number(),
  magicPower: Joi.number(),
  physPower: Joi.number(),
  flat: Joi.number(),
  parentEffectParam: Joi.object()
})

const ACTION_SCHEMA = Joi.object({
  applyStatusEffect: Joi.object({
    affects: Joi.string().valid('self', 'enemy', 'target'),
    statusEffect: Joi.custom(val => {
      return Joi.attempt(val, STATUS_EFFECT_SCHEMA)
    }).required()
  }),
  attack: Joi.object({
    damageType: DAMAGE_TYPE_SCHEMA,
    scaling: SCALED_NUMBER_SCHEMA,
    range: Joi.array().length(2).items(Joi.number())
  }),
  gainHealth: Joi.object({
    scaling: SCALED_NUMBER_SCHEMA
  }),
  takeDamage: Joi.object({
    scaling: SCALED_NUMBER_SCHEMA,
    damageType: DAMAGE_TYPE_SCHEMA,
    ignoreDefense: Joi.bool().truthy(),
    ignoreOvertime: Joi.bool().truthy()
  })
})

const REPLACEMENT_SCHEMA = Joi.object({
  dataMerge: Joi.object({
    forceDodge: Joi.boolean()
  })
})

const TRIGGERS_SCHEMA = Joi.object({
  combatTime: Joi.number().integer(),
  attackHit: Joi.alternatives().try(
    Joi.object({
      damageType: DAMAGE_TYPE_SCHEMA
    }),
    Joi.bool().truthy()),
  active: Joi.bool().truthy(),
  attacked: Joi.bool().truthy(),
  instant: Joi.bool().truthy()
})

const ABILITY_SCHEMA = Joi.object({
  conditions: Joi.object({
    source: Joi.string().valid(...SUBJECT_KEYS),
    hpPctBelow: Joi.number()
  }),
  initialCooldown: Joi.number().integer(),
  cooldown: Joi.number().integer(),
  replacements: REPLACEMENT_SCHEMA,
  abilityId: Joi.string(),
  actions: Joi.array().items(ACTION_SCHEMA),
  uses: Joi.number().integer(),
  trigger: TRIGGERS_SCHEMA.required()
}).xor('replacements', 'actions')

export const EFFECT_SCHEMA = Joi.object({
  abilities: Joi.array().items(ABILITY_SCHEMA),
  stats: STATS_SCHEMA,
  conditions: Joi.object({
    deepestFloor: Joi.boolean()
  }),
  statics: STATICS_SCHEMA
})

export const STATUS_EFFECT_SCHEMA = EFFECT_SCHEMA.append({
  base: Joi.string().valid(...Object.keys(StatusEffects)),
  duration: Joi.number().integer(),
  stacking: Joi.string(),
  isBuff: Joi.boolean(),
  name: Joi.string(),
  persisting: Joi.boolean().truthy(),
  Xparams: Joi.object()
}).or('base', 'isBuff')

export function validateAllStatusEffects(){
  for(let id in StatusEffects){
    try {
      validateStatusEffect(id)
    }catch(ex){
      throw `StatusEffect "${id}" failed validation: ` + ex.message
    }
  }
}

function validateStatusEffect(id){
  let def = StatusEffects[id].def
  if(_.isFunction(def)){
    def = def({},{})
  }
  Joi.assert(def, STATUS_EFFECT_SCHEMA)
}