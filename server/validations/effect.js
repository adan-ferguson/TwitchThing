import { SUBJECT_KEYS, SUBJECT_KEYS_SCHEMA } from './subjectKeys.js'
import Joi from 'joi'
import { STATS_MODIFIERS_SCHEMA, STATS_NAME_SCHEMA, STATS_NUMBER_SCHEMA, STATS_SCHEMA } from './stats.js'
import { DAMAGE_TYPE_SCHEMA } from './damage.js'
import { MODS_SCHEMA } from './mods.js'
import { status as StatusEffects, phantom as PhantomEffects } from '../../game/baseEffects/combined.js'
import StatusEffectInstance from '../../game/baseEffects/statusEffectInstance.js'
import PhantomEffectInstance from '../../game/baseEffects/phantomEffectInstance.js'
import { TAGS_LIST_SCHEMA } from './tagNames.js'
import { ABILITY_CONDITIONS_SCHEMA, FIGHTER_INSTANCE_CONDITIONS_SCHEMA } from './conditions.js'
import { POLARITY_SCHEMA } from './polarity.js'
import { TRIGGER_NAME_SCHEMA } from './triggers.js'


const SCALED_NUMBER_SCHEMA = Joi.object({
  hpMax: Joi.number(),
  hpMissing: Joi.number(),
  hp: Joi.number(),
  magicPower: Joi.number(),
  physPower: Joi.number(),
  flat: Joi.number(),
  parentEffectParam: Joi.object(),
})

const OPTIONAL_SCALED_NUMBER_SCHEMA = Joi.alternatives().try(
  Joi.object({ scaledNumber: SCALED_NUMBER_SCHEMA }),
  Joi.number()
)

const TARGETS_SCHEMA = Joi.string().valid('self', 'enemy', 'target', 'source', 'all')

const ATTACK_SCHEMA = Joi.object({
  targets: TARGETS_SCHEMA,
  damageType: DAMAGE_TYPE_SCHEMA,
  scaling: SCALED_NUMBER_SCHEMA.required(),
  lifesteal: Joi.number().positive(),
  range: Joi.array().length(2).items(Joi.number()),
  hits: Joi.number().integer(),
  cantDodge: Joi.bool(),
  cantMiss: Joi.bool(),
})

const as = Joi.object({
  applyStatusEffect: Joi.object({
    targets: TARGETS_SCHEMA.required(),
    statusEffect: Joi.custom(val => {
      return Joi.attempt(val, STATUS_EFFECT_SCHEMA)
    }).required()
  }),
  attack: ATTACK_SCHEMA,
  targetScaledAttack: ATTACK_SCHEMA,
  gainHealth: Joi.object({
    scaling: SCALED_NUMBER_SCHEMA.required(),
  }),
  dealDamage: Joi.object({
    scaling: SCALED_NUMBER_SCHEMA.required(),
    targets: TARGETS_SCHEMA.required(),
    damageType: DAMAGE_TYPE_SCHEMA,
  }),
  takeDamage: Joi.object({
    scaling: SCALED_NUMBER_SCHEMA.required(),
    damageType: DAMAGE_TYPE_SCHEMA,
    ignoreDefense: Joi.bool().truthy(),
    ignoreOvertime: Joi.bool().truthy()
  }),
  // useAbility: Joi.object({
  //   subject: {
  //     key: Joi.string().valid(...SUBJECT_KEYS).required(),
  //   },
  //   trigger: TRIGGER_NAME_SCHEMA,
  // }),
  modifyAbility: Joi.object({
    targets: TARGETS_SCHEMA,
    subject: Joi.object(),
    trigger: TRIGGER_NAME_SCHEMA,
    modification: Joi.object({
      cooldownRemaining: Joi.object({
        flat: Joi.number().integer(),
        remaining: Joi.number().min(0),
        total: Joi.number().min(0),
      })
    }).required()
  }),
  modifyStatusEffect: Joi.object({
    targets: TARGETS_SCHEMA,
    subject: Joi.object({
      name: Joi.string(),
      key: SUBJECT_KEYS_SCHEMA,
      polarity: POLARITY_SCHEMA
    }).required(),
    modification: Joi.object({
      stacks: Joi.number().integer(),
      remove: Joi.bool(),
    }).required(),
    count: Joi.number().integer().min(1)
  }),
  shieldBash: Joi.object({
    physPower: Joi.number(),
    stunMin: Joi.number(),
  }),
  balancedSmite: Joi.object({
    power: Joi.number().required()
  }),
  shieldsUp: Joi.object({
    multiplier: Joi.number().required()
  }),
  spikedShield: Joi.object({
    pctReturn: Joi.number().required()
  }),
  penance: Joi.object({
    pct: Joi.number().required()
  }),
  breakItem: Joi.object({
    statusEffect: Joi.custom(val => {
      return Joi.attempt(val, STATUS_EFFECT_SCHEMA)
    }),
    count: Joi.number().integer().min(1)
  }),
  terribleCurse: Joi.object({
    attackScaling: Joi.number(),
  }),
  terribleSituation: Joi.bool(),
  painTrain: Joi.object({
    magicPower: Joi.number()
  }),
  random: {
    options: Joi.array().items(Joi.object({
      weight: Joi.number().required(),
      value: Joi.custom(val => {
        return Joi.attempt(val, as)
      }).required(),
    }))
  },
  maybe: {
    chance: Joi.number().min(0).max(1).required(),
    action: Joi.custom(val => {
      return Joi.attempt(val, as)
    }).required(),
  },
  fireSpiritExplode: {
    ratio: Joi.number()
  },
  returnDamage: {
    damageType: DAMAGE_TYPE_SCHEMA,
    returnDamageType: DAMAGE_TYPE_SCHEMA,
    pct: Joi.number().min(0),
  },
  furiousStrikes: {
    base: Joi.number().integer(),
    per: Joi.number().min(1),
    damagePer: Joi.number().greater(0)
  },
  elementalBreath: {
    magicPower: Joi.number(),
    burn: Joi.number(),
    slow: Joi.number(),
    weaken: Joi.string(),
  },
  mushroomSpores: {},
  explode: {
    scaling: SCALED_NUMBER_SCHEMA,
  },
}).max(1)

const ACTION_SCHEMA = Joi.alternatives().try(
  as,
  Joi.array().items(as)
)

const REPLACEMENT_SCHEMA = Joi.object({
  dataMerge: Joi.object(),
  cancel: Joi.string()
})

const ABILITY_SCHEMA = Joi.object({
  trigger: TRIGGER_NAME_SCHEMA.required(),
  conditions: ABILITY_CONDITIONS_SCHEMA,
  abilityId: Joi.string(),
  initialCooldown: Joi.number().integer(),
  cooldown: Joi.number().integer(),
  resetAfterCombat: Joi.bool(),
  turnRefund: Joi.number().min(0),
  repetitions: Joi.number().integer().min(1),
  replacements: REPLACEMENT_SCHEMA,
  actions: Joi.array().items(ACTION_SCHEMA),
  uses: Joi.number().integer(),
  exclusiveStats: STATS_SCHEMA,
  phantomEffect: Joi.custom(val => {
    return Joi.attempt(val, PHANTOM_EFFECT_SCHEMA)
  }),
  uncancellable: Joi.bool(),
  tags: TAGS_LIST_SCHEMA,
  vars: Joi.object()
})

const es = Joi.object({
  effectId: Joi.string(),
  abilities: Joi.array().items(ABILITY_SCHEMA),
  stats: STATS_SCHEMA,
  statsModifiers: STATS_MODIFIERS_SCHEMA,
  mods: MODS_SCHEMA,
  exclusiveStats: STATS_SCHEMA,
  exclusiveMods: MODS_SCHEMA,
  transStats: Joi.array().items(Joi.object({
    from: STATS_NAME_SCHEMA.required(),
    to: STATS_NAME_SCHEMA.required(),
    ratio: Joi.number()
  })),
  statMultiplier: Joi.number().min(0),
  tags: TAGS_LIST_SCHEMA,
  vars: Joi.object()
})

export const META_EFFECT_SCHEMA = Joi.object({
  metaEffectId: Joi.string(),
  conditions: Joi.object({
    owner: FIGHTER_INSTANCE_CONDITIONS_SCHEMA
  }),
  subject: Joi.object({
    key: SUBJECT_KEYS_SCHEMA,
    id: Joi.string(),
    polarity: POLARITY_SCHEMA,
  }).required(),
  effectModification: {
    stats: STATS_SCHEMA,
    mods: MODS_SCHEMA,
    exclusiveStats: STATS_SCHEMA,
    exclusiveMods: MODS_SCHEMA,
    statMultiplier: Joi.number().min(0),
    addAbility: ABILITY_SCHEMA,
    abilityModification: Joi.object({
      abilityModificationId: Joi.string(),
      trigger: TRIGGER_NAME_SCHEMA,
      newTrigger: TRIGGER_NAME_SCHEMA,
      turnRefund: Joi.number().min(0),
      repetitions: Joi.number().integer().min(1),
      exclusiveStats: STATS_SCHEMA,
      addAction: ACTION_SCHEMA,
      cooldown: STATS_NUMBER_SCHEMA,
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
    blinded: Joi.object({
      duration: OPTIONAL_SCALED_NUMBER_SCHEMA
    }),
    stunned: Joi.object({
      replaceMe: Joi.string().valid('shieldBashStun'),
      duration: OPTIONAL_SCALED_NUMBER_SCHEMA
    }),
    charmed: Joi.object({
      duration: OPTIONAL_SCALED_NUMBER_SCHEMA
    }),
    slowed: Joi.object({
      speed: OPTIONAL_SCALED_NUMBER_SCHEMA
    }),
    asleep: Joi.object({
      duration: OPTIONAL_SCALED_NUMBER_SCHEMA
    }),
    barrier: Joi.object({
      hp: OPTIONAL_SCALED_NUMBER_SCHEMA
    }),
    disarmed: Joi.object({
      replaceMe: Joi.string().valid('randomItemSlotInfo')
    })
  }),
  barrier: Joi.object({
    hp: Joi.number().integer()
  }),
  statusEffectId: Joi.string(),
  turns: Joi.number().integer(),
  duration: Joi.number().integer(),
  stacking: Joi.string().valid('stack', 'replace', 'extend', null),
  stackingId: Joi.string(),
  startingStacks: Joi.number().integer(),
  maxStacks: Joi.number().integer(),
  polarity: POLARITY_SCHEMA,
  name: Joi.string(),
  persisting: Joi.boolean().truthy(),
  diminishingReturns: Joi.boolean(),
  cantRemove: Joi.boolean(),
})

export const PHANTOM_EFFECT_SCHEMA = EFFECT_SCHEMA.append({
  base: Joi.object()
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