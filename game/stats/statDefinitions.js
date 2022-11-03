export const StatType = {
  FLAT: 0,
  MULTIPLIER: 1, // 0 to infinity, default is 1
  PERCENTAGE: 2, // 0 to 1, default is 0
  COMPOSITE: 3
}

const DEFAULT_DEFINITION = {
  type: StatType.COMPOSITE,
  minValue: null,           // derived from type if null
  maxValue: null,           // derived from type if nul
  defaultValue: null,       // derived from type if null
  roundingDecimals: 3,
  inverted: false           // If inverted, lower = better & higher = worse
}

const defs = {
  attacks: {
    roundingDecimals: 0,
    defaultValue: 1,
    minValue: 1
  },
  chestFind: {
    type: StatType.MULTIPLIER
  },
  combatHarderChance: {
    type: StatType.MULTIPLIER
  },
  combatXP: {
    type: StatType.MULTIPLIER
  },
  critChance: {
    minValue: 0,
    maxValue: 1
  },
  critDamage: {
    type: StatType.MULTIPLIER
  },
  damageDealt: {
    type: StatType.MULTIPLIER
  },
  damageTaken: {
    type: StatType.MULTIPLIER,
    inverted: true
  },
  dodgeChance: {
    type: StatType.PERCENTAGE
  },
  enemyCritChance: {
    inverted: true
  },
  hpMax: {
    roundingDecimals: 0
  },
  landmarkFind: {
    type: StatType.MULTIPLIER
  },
  lifesteal: {
    minValue: 0
  },
  magicPower: {
    minValue: 0,
    roundingDecimals: 0
  },
  magicDef: {
    type: StatType.PERCENTAGE
  },
  mainHandDamage: {
    type: StatType.PERCENTAGE
  },
  mainHandCooldownReduction: {
    type: StatType.PERCENTAGE
  },
  missChance: {
    type: StatType.PERCENTAGE,
    inverted: true
  },
  physPower: {
    minValue: 0,
    roundingDecimals: 0
  },
  physDef: {
    type: StatType.PERCENTAGE
  },
  relicRareChance: {
    type: StatType.MULTIPLIER
  },
  relicSolveChance: {
    type: StatType.MULTIPLIER
  },
  rewards: {
    type: StatType.MULTIPLIER
  },
  regen: {
    minValue: 0
  },
  speed: {
    type: StatType.FLAT,
    roundingDecimals: 0
  },
  slow: {
    inverted: true,
    minValue: 0
  }
}

for(let key in defs){
  defs[key] = {
    ...DEFAULT_DEFINITION,
    ...defs[key],
    name: key
  }
}

export const StatDefinitions = defs