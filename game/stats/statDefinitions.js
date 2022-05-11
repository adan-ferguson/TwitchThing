export const StatType = {
  FLAT: 0, // Can add both flat and percentage
  MULTIPLIER: 1, // 0 to infinity, default is 1
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
  hpMax: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER,
    roundingDecimals: 0
  },
  speed: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  physPower: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  magicPower: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  physDef: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER,
    inverted: true
  },
  magicDef: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER,
    inverted: true
  },
  lifesteal: {
    ...DEFAULT_DEFINITION,
    minValue: 0
  },
  xpGain: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  stairFind: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  },
  relicFind: {
    ...DEFAULT_DEFINITION,
    type: StatType.MULTIPLIER
  }
}