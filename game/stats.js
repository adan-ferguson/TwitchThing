export default class Stats{

  constructor(statAffectors){
    this._statAffectors = statAffectors
  }

  getStat(type){
    let stat = StatDefinitions[type]

    if(!stat){
      throw 'Unknown stat type: ' + type
    }

    stat = {
      ...DEFAULT_DEFINITION,
      ...stat
    }

    if(stat.type === StatType.COMPOSITE){
      return this.getCompositeStat(stat.type)
    }else if(stat.type === StatType.FLAT){
      return this.getFlatStatMod(stat.type)
    }else if(stat.type === StatType.PERCENTAGE){
      return this.getPctStatMod(stat.type)
    }
  }

  getCompositeStat(type){
    return this.getFlatStatMod(type) * this.getPctStatMod(type + 'Pct')
  }

  getFlatStatMod(type){
    return this._statAffectors.reduce((val, statAffector) => {
      return val + (statAffector[type] || 0)
    }, 0)
  }

  getPctStatMod(type){
    return this._statAffectors.reduce((val, statAffector) => {
      return val * (statAffector[type] || 1)
    }, 1)
  }
}

export function mergeStats(...statsObjs){
  const combined = {}
  statsObjs.forEach(obj => {
    for(let key in obj){
      if(!combined[key]){
        combined[key] = 0
      }
      combined[key] += obj[key]
    }
  })
  return combined
}

export const StatType = {
  COMPOSITE: 0,
  FLAT: 1,
  PERCENTAGE: 2
}

/**
 * Where the stat shows up during levelup bonus
 */
export const StatBonusCategory = {
  NONE: 0,
  OFFENSIVE: 1,
  DEFENSIVE: 2,
  MISC: 3
}

const DEFAULT_DEFINITION = {
  weight: false,
  category: StatBonusCategory.NONE,
  type: StatType.COMPOSITE,
  growing: false,
}

const StatDefinitions = {
  attack: {
    weight: 20,
    category: StatBonusCategory.OFFENSIVE,
    growing: true
  },
  speed: {
    weight: 10,
    type: StatType.FLAT,
    category: StatBonusCategory.OFFENSIVE
  },
  hpMax: {
    weight: 1,
    category: StatBonusCategory.DEFENSIVE,
    growing: true
  },
  armor: {
    weight: 50,
    category: StatBonusCategory.DEFENSIVE,
    growing: true
  },
  lifesteal: {
    weight: 20,
    category: StatBonusCategory.DEFENSIVE,
    type: StatType.FLAT
  },
  adventuringSpeed: {
    weight: 10,
    type: StatType.FLAT,
    category: StatBonusCategory.MISC
  },
  combatXP: {
    weight: 8,
    type: StatType.PERCENTAGE,
    category: StatBonusCategory.MISC,
  },
  stairFind: {
    weight: 7,
    type: StatType.PERCENTAGE,
    category: StatBonusCategory.MISC,
  },
  relicFind: {
    weight: 7,
    type: StatType.PERCENTAGE,
    category: StatBonusCategory.MISC,
  },
}