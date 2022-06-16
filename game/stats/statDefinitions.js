export const StatType = {
  FLAT: 0,
  MULTIPLIER: 1, // 0 to infinity, default is 1
  PERCENTAGE: 2, // 0 to 1, default is 0
}

const DEFAULT_DEFINITION = {
  type: StatType.FLAT,
  minValue: null,           // derived from type if null
  maxValue: null,           // derived from type if null
  defaultValue: null,       // derived from type if null
  roundingDecimals: 3,
  inverted: false           // If inverted, lower = better & higher = worse
}

export const StatDefinitions = {
  chestFind: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  combatXP: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  critChance: {
    ...DEFAULT_DEFINITION,
    type: StatType.FLAT,
    minValue: 0
  },
  critDamage: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  dodgeChance: {
    ...DEFAULT_DEFINITION,
    type: StatType.PERCENTAGE
  },
  hpMax: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  lifesteal: {
    ...DEFAULT_DEFINITION,
    minValue: 0
  },
  magicPower: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  magicDef: {
    ...DEFAULT_DEFINITION,
    type: StatType.PERCENTAGE
  },
  physPower: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  physDef: {
    ...DEFAULT_DEFINITION,
    type: StatType.PERCENTAGE
  },
  relicFind: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  relicKnowledge: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  regen: {
    ...DEFAULT_DEFINITION,
    type: StatType.FLAT
  },
  speed: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  }
}