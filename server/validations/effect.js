import { SUBJECT_KEYS } from './subjectKeys.js'
import Joi from 'joi'
import { STATS_SCHEMA } from './stats.js'
import { DAMAGE_TYPE_SCHEMA } from './damage.js'
import { MODS_SCHEMA } from './mods.js'
import { status as StatusEffects, phantom as PhantomEffects } from '../../game/baseEffects/combined.js'
import StatusEffectInstance from '../../game/baseEffects/statusEffectInstance.js'
import PhantomEffectInstance from '../../game/baseEffects/phantomEffectInstance.js'


const SCALED_NUMBER_SCHEMA = Joi.object({
  hpMax: Joi.number(),
  hpMissingPct: Joi.number(),
  hp: Joi.number(),
  magicPower: Joi.number(),
  physPower: Joi.number(),
  flat: Joi.number(),
  parentEffectParam: Joi.object()
})

const OPTIONAL_SCALED_NUMBER_SCHEMA = Joi.alternatives().try(
  Joi.object({ scaledNumber: SCALED_NUMBER_SCHEMA }),
  Joi.number()
)

const TRIGGERS_SCHEMA = Joi.object({
  combatTime: Joi.number().integer(),
  attackHit: Joi.alternatives().try(
    Joi.object({
      damageType: DAMAGE_TYPE_SCHEMA
    }),
    Joi.bool().truthy()),
  active: Joi.bool().truthy(),
  attacked: Joi.bool().truthy(),
  attack: Joi.bool().truthy(),
  instant: Joi.bool().truthy(),
  rest: Joi.bool().truthy(),
  gainingDebuff: Joi.bool().truthy(),
  useAbility: Joi.bool().truthy(),
  hitByAttack: Joi.bool().truthy(),
  targeted: Joi.bool().truthy()
})

const as = Joi.object({
  applyStatusEffect: Joi.object({
    targets: Joi.string().valid('self', 'enemy', 'target'),
    statusEffect: Joi.custom(val => {
      return Joi.attempt(val, STATUS_EFFECT_SCHEMA)
    }).required()
  }),
  attack: Joi.object({
    damageType: DAMAGE_TYPE_SCHEMA,
    scaling: SCALED_NUMBER_SCHEMA,
    lifesteal: Joi.number().positive(),
    range: Joi.array().length(2).items(Joi.number()),
    hits: Joi.number().integer(),
    undodgeable: Joi.bool()
  }),
  gainHealth: Joi.object({
    scaling: SCALED_NUMBER_SCHEMA
  }),
  takeDamage: Joi.object({
    scaling: SCALED_NUMBER_SCHEMA,
    damageType: DAMAGE_TYPE_SCHEMA,
    ignoreDefense: Joi.bool().truthy(),
    ignoreOvertime: Joi.bool().truthy()
  }),
  useEffectAbility: Joi.object({
    subject: Joi.string().valid(...SUBJECT_KEYS),
    trigger: Joi.string().valid(...Object.keys(TRIGGERS_SCHEMA.describe().keys))
  }),
})

const ACTION_SCHEMA = as.append({
  random: {
    options: Joi.array().items(Joi.object({
      weight: Joi.number().required(),
      value: as.required()
    }))
  }
})

const REPLACEMENT_SCHEMA = Joi.object({
  dataMerge: Joi.object(),
  cancel: Joi.string()
})

const CONDITIONS_SCHEMA = Joi.object({
  source: Joi.string().valid(...SUBJECT_KEYS), // Are we a subject of source + subjectKey combination?
  hpPctBelow: Joi.number(),   // Is our hpPct below this number?
  bossFight: Joi.bool(),      // Are we in a boss fight?
  deepestFloor: Joi.bool(),   // Are we on the adventurer's deepest floor?
  attackDodgeable: Joi.bool() // Are we being attacked by a dodgeable attack?
})

const ABILITY_SCHEMA = Joi.object({
  conditions: CONDITIONS_SCHEMA,
  initialCooldown: Joi.number().integer(),
  cooldown: Joi.number().integer(),
  replacements: REPLACEMENT_SCHEMA,
  resetCooldownAfterCombat: Joi.bool(),
  abilityId: Joi.string(),
  actions: Joi.array().items(ACTION_SCHEMA),
  uses: Joi.number().integer(),
  trigger: TRIGGERS_SCHEMA.required(),
  phantomEffect: Joi.custom(val => {
    return Joi.attempt(val, PHANTOM_EFFECT_SCHEMA)
  })
})

const es = Joi.object({
  effectId: Joi.string(),
  abilities: Joi.array().items(ABILITY_SCHEMA),
  stats: STATS_SCHEMA,
  conditions: CONDITIONS_SCHEMA,
  mods: MODS_SCHEMA,
  exclusiveStats: STATS_SCHEMA,
  exclusiveMods: MODS_SCHEMA,
  statMultiplier: Joi.number().min(0)
})

const ms = {}
SUBJECT_KEYS.forEach(sk => {
  ms[sk] = es.append({
    metaEffectId: Joi.string(),
    metaEffectConditions: CONDITIONS_SCHEMA
  })
})

export const META_EFFECT_SCHEMA = Joi.object(ms)

export const EFFECT_SCHEMA = es.append({
  metaEffect: META_EFFECT_SCHEMA
})

export const STATUS_EFFECT_SCHEMA = EFFECT_SCHEMA.append({
  base: Joi.object({
    damageOverTime: Joi.object({
      damage: OPTIONAL_SCALED_NUMBER_SCHEMA
    })
  }),
  statusEffectId: Joi.string(),
  turns: Joi.number().integer(),
  duration: Joi.number().integer(),
  stacking: Joi.string(),
  maxStacks: Joi.number().integer(),
  polarity: Joi.string().valid('buff','debuff','negativity'),
  name: Joi.string(),
  persisting: Joi.boolean().truthy(),
  vars: Joi.object()
})

export const PHANTOM_EFFECT_SCHEMA = EFFECT_SCHEMA.append({
  base: Joi.object({
    attackAppliesStatusEffect: STATUS_EFFECT_SCHEMA
  })
})

export function validateAllBaseEffects(){
  for(let id in StatusEffects){
    try {
      validateStatusEffect(id)
    }catch(ex){
      throw `StatusEffect "${id}" failed validation: ` + ex.message
    }
  }
  for(let id in PhantomEffects){
    try {
      validatePhantomEffect(id)
    }catch(ex){
      throw `PhantomEffect "${id}" failed validation: ` + ex.message
    }
  }
}

function validateStatusEffect(id){
  const sei = new StatusEffectInstance({ base: { [id]: undefined } }, {})
  Joi.assert(sei.baseEffectData, STATUS_EFFECT_SCHEMA)
}

function validatePhantomEffect(id){
  const pei = new PhantomEffectInstance({ base: { [id]: undefined } }, {})
  Joi.assert(pei.baseEffectData, EFFECT_SCHEMA)
}