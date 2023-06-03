import { SUBJECT_KEYS, SUBJECT_KEYS_SCHEMA } from './subjectKeys.js'
import Joi from 'joi'
import { STATS_SCHEMA } from './stats.js'
import { DAMAGE_TYPE_SCHEMA } from './damage.js'
import { MODS_SCHEMA } from './mods.js'
import { status as StatusEffects, phantom as PhantomEffects } from '../../game/baseEffects/combined.js'
import StatusEffectInstance from '../../game/baseEffects/statusEffectInstance.js'
import PhantomEffectInstance from '../../game/baseEffects/phantomEffectInstance.js'
import { TAG_NAME_SCHEMA, TAGS_LIST_SCHEMA } from './tagNames.js'


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

const ts = Joi.object({
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
})

export const TRIGGER_NAMES_SCHEMA = Joi.string().valid('targeted', ...Object.keys(ts.describe().keys))

const TRIGGERS_SCHEMA = ts.append({
  targeted: Joi.alternatives().try(
    Joi.bool().truthy(),
    Joi.object({
      triggerType: TRIGGER_NAMES_SCHEMA,
      hasTag: TAG_NAME_SCHEMA
    })
  )
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
  useAbility: Joi.object({
    subjectKey: Joi.string().valid(...SUBJECT_KEYS).required(),
    trigger: TRIGGER_NAMES_SCHEMA
  }),
  modifyAbility: Joi.object({
    subjectKey: Joi.string().valid(...SUBJECT_KEYS).required(),
    trigger: TRIGGER_NAMES_SCHEMA,
    modification: Joi.object({
      cooldownRemaining: Joi.number().integer()
    }).required()
  })
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
  trigger: TRIGGERS_SCHEMA.required(),
  conditions: CONDITIONS_SCHEMA,
  abilityId: Joi.string(),
  initialCooldown: Joi.number().integer(),
  cooldown: Joi.number().integer(),
  resetCooldownAfterCombat: Joi.bool(),
  turnRefund: Joi.number().min(0),
  repetitions: Joi.number().integer().min(1),
  replacements: REPLACEMENT_SCHEMA,
  actions: Joi.array().items(ACTION_SCHEMA),
  uses: Joi.number().integer(),
  phantomEffect: Joi.custom(val => {
    return Joi.attempt(val, PHANTOM_EFFECT_SCHEMA)
  }),
  tags: TAGS_LIST_SCHEMA,
  vars: Joi.object()
})

const es = Joi.object({
  effectId: Joi.string(),
  abilities: Joi.array().items(ABILITY_SCHEMA),
  stats: STATS_SCHEMA,
  mods: MODS_SCHEMA,
  exclusiveStats: STATS_SCHEMA,
  exclusiveMods: MODS_SCHEMA,
  statMultiplier: Joi.number().min(0),
  tags: TAGS_LIST_SCHEMA
})

export const META_EFFECT_SCHEMA = Joi.object({
  metaEffectId: Joi.string(),
  conditions: CONDITIONS_SCHEMA,
  subjectKey: SUBJECT_KEYS_SCHEMA.required(),
  effectModification: {
    stats: STATS_SCHEMA,
    mods: MODS_SCHEMA,
    exclusiveStats: STATS_SCHEMA,
    exclusiveMods: MODS_SCHEMA,
    statMultiplier: Joi.number().min(0),
    abilityModification: Joi.object({
      abilityModificationId: Joi.string(),
      trigger: TRIGGER_NAMES_SCHEMA,
      turnRefund: Joi.number().min(0),
      repetitions: Joi.number().integer().min(1),
      exclusiveStats: STATS_SCHEMA,
      addAction: ACTION_SCHEMA,
      vars: Joi.object()
    })
  }
})

export const EFFECT_SCHEMA = es.append({
  metaEffects: Joi.array().items(META_EFFECT_SCHEMA)
})

export const STATUS_EFFECT_SCHEMA = EFFECT_SCHEMA.append({
  base: Joi.object({
    damageOverTime: Joi.object({
      damage: OPTIONAL_SCALED_NUMBER_SCHEMA,
      damageType: DAMAGE_TYPE_SCHEMA,
    }),
    stunned: Joi.number().integer().positive()
  }),
  statusEffectId: Joi.string(),
  turns: Joi.number().integer(),
  duration: Joi.number().integer(),
  stacking: Joi.string(),
  stackingId: Joi.string(),
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