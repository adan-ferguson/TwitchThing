export const StatType = {
  FLAT: 0,
  MULTIPLIER: 1, // 0 to infinity, default is 1
  PERCENTAGE: 2, // 0 to 1, default is 0
}

const DEFAULT_DEFINITION = {
  type: StatType.FLAT,
  minValue: null,           // derived from type if null
  maxValue: null,           // derived from type if nul
  defaultValue: null,       // derived from type if null
  roundingDecimals: 3,
  inverted: false           // If inverted, lower = better & higher = worse
}

const defs = {
  chestFind: {
    type: StatType.MULTIPLIER
  },
  combatXP: {
    type: StatType.MULTIPLIER
  },
  critChance: {
    type: StatType.FLAT,
    minValue: 0
  },
  critDamage: {
    type: StatType.MULTIPLIER
  },
  dodgeChance: {
    type: StatType.PERCENTAGE
  },
  hpMax: {
    type: StatType.MULTIPLIER
  },
  landmarkFind: {
    type: StatType.MULTIPLIER
  },
  lifesteal: {
    minValue: 0
  },
  magicPower: {
    type: StatType.MULTIPLIER
  },
  magicDef: {
    type: StatType.PERCENTAGE
  },
  physPower: {
    type: StatType.MULTIPLIER
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
  regen: {
    type: StatType.FLAT
  },
  speed: {
    type: StatType.MULTIPLIER
  },
}

for(let key in defs){
  defs[key] = {
    ...DEFAULT_DEFINITION,
    ...defs[key],
    name: key
  }
}

export const StatDefinitions = defs