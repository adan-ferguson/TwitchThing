export const StatType = {
  COMPOSITE: 0, // Can add both flat and percentage
  MULTIPLIER: 1, // 0 to infinity, default is 1
  PERCENTAGE: 2, // 0 to 1, default is 0
  ADDITIVE_MULTIPLIER: 3 // 20% + 20% = 1.4, but 20% - 50% = 0.6
}

/**
 * Where the stat shows up during levelup bonus
 */
export const StatBonusCategory = {
  NONE: 0,
  OFFENSIVE: 1,
  DEFENSIVE: 2,
  ADVENTURING: 3
}

const DEFAULT_DEFINITION = {
  weight: false,
  category: StatBonusCategory.NONE,
  type: StatType.COMPOSITE,
  rarity: 999
}

export const StatDefinitions = {
  attack: {
    ...DEFAULT_DEFINITION,
    weight: 20,
    category: StatBonusCategory.OFFENSIVE,
    scaling: true,
    rarity: 1
  },
  hpMax: {
    ...DEFAULT_DEFINITION,
    weight: 1,
    category: StatBonusCategory.DEFENSIVE,
    scaling: true,
    rarity: 1
  },
  speed: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    category: StatBonusCategory.OFFENSIVE,
    type: StatType.ADDITIVE_MULTIPLIER,
    rarity: 2
  },
  physDef: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    type: StatType.PERCENTAGE,
    category: StatBonusCategory.DEFENSIVE,
    rarity: 2
  },
  lifesteal: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    category: StatBonusCategory.DEFENSIVE,
    rarity: 3,
    minimum: 0
  },
  adventuringSpeed: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    type: StatType.ADDITIVE_MULTIPLIER,
    category: StatBonusCategory.ADVENTURING,
    rarity: 3
  },
  xpGain: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    type: StatType.ADDITIVE_MULTIPLIER,
    category: StatBonusCategory.ADVENTURING,
    rarity: 3
  },
  stairFind: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    type: StatType.ADDITIVE_MULTIPLIER,
    category: StatBonusCategory.ADVENTURING,
    rarity: 2
  },
  relicFind: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    type: StatType.ADDITIVE_MULTIPLIER,
    category: StatBonusCategory.ADVENTURING,
    rarity: 3
  },
}