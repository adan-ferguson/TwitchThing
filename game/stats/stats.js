import { StatDefinitions, StatType } from './statDefinitions.js'
import statValueFns from './statValueFns.js'
import { calcStatDiff } from './statDiff.js'

export default class Stats{

  baseAffectors = []
  bonusAffectors = []

  /**
   * @param baseStats {[object],object,Stats}
   * @param bonusStats {[object],object,Stats}
   */
  constructor(baseStats, bonusStats = []){
    this.baseAffectors = toArray(baseStats)
    this.bonusAffectors = toArray(bonusStats)
  }

  get affectors(){
    return this.baseAffectors.concat(this.bonusAffectors)
  }

  get(name){
    let stat = StatDefinitions[name]

    if(!stat){
      throw 'Unknown stat name: ' + name
    }

    const fn = statValueFns[stat.type]

    if(!fn){
      throw 'Missing value function for stat type: ' + stat.type
    }

    const baseValue = fn(this.baseAffectors, name)
    const totalValue = fn(this.affectors, name)
    return makeStatObject(name, baseValue, totalValue)
  }

  getAll(){
    const all = {}
    this.affectors.forEach(affector => {
      Object.keys(affector).forEach(key => {
        all[key] = true
      })
    })
    const allStats = {}
    Object.keys(all).forEach(type => allStats[type] = this.get(type))
    return allStats
  }

  serialize(){
    const serialized = {}
    Object.entries(this.getAll()).forEach(([statName, statDef]) => {
      serialized[statName] = statDef.value
    })
    return serialized
  }
}

export function makeStatObject(name, baseValue, totalValue){
  const stat = StatDefinitions[name]
  if('minimum' in stat){
    baseValue = Math.max(0, baseValue)
    totalValue = Math.max(0, totalValue)
  }
  return {
    ...stat,
    name,
    diff: calcStatDiff(defaultValue(stat), baseValue, totalValue),
    baseValue,
    value: totalValue
  }
}

export function mergeStats(...statsObjs){
  return new Stats(
    merge('baseAffectors'),
    merge('bonusAffectors')
  )
  function merge(propName){
    return statsObjs
      .filter(o => o)
      .reduce((arr, statsObj) => {
        return [...arr, ...statsObj[propName]]
      }, [])
  }
}

/**
 * @param val {object,[object],Stats}
 * @returns [object]
 */
function toArray(val){
  if(Array.isArray(val)){
    return val
  }else if(val instanceof Stats){
    return val.affectors
  }else{
    return [val]
  }
}

function defaultValue(stat){
  if(stat.type === StatType.ADDITIVE_MULTIPLIER){
    return 1
  }
  return 0
}