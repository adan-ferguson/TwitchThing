export const StatType = {
  COMPOSITE: 0,
  LOLSCALED: 1,
  LOLSCALEDINVERTED: 2,
  ADDITIVE_PERCENTAGE: 3
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
    type: StatType.LOLSCALED,
    rarity: 2
  },
  armor: {
    ...DEFAULT_DEFINITION,
    weight: 40,
    category: StatBonusCategory.DEFENSIVE,
    type: StatType.LOLSCALEDINVERTED,
    rarity: 2,
    minimum: 0
  },
  lifesteal: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    category: StatBonusCategory.DEFENSIVE,
    rarity: 3
  },
  adventuringSpeed: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    type: StatType.ADDITIVE_PERCENTAGE,
    category: StatBonusCategory.ADVENTURING,
    rarity: 3
  },
  xpGain: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    type: StatType.ADDITIVE_PERCENTAGE,
    category: StatBonusCategory.ADVENTURING,
    rarity: 3
  },
  stairFind: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    type: StatType.ADDITIVE_PERCENTAGE,
    category: StatBonusCategory.ADVENTURING,
    rarity: 2
  },
  relicFind: {
    ...DEFAULT_DEFINITION,
    weight: 2,
    type: StatType.ADDITIVE_PERCENTAGE,
    category: StatBonusCategory.ADVENTURING,
    rarity: 3
  },
}