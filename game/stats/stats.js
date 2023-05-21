import statValueFns from './statValueFns.js'
import { calcStatDiff } from './statDiff.js'
import { roundToFixed } from '../utilFunctions.js'
import { makeStatObject } from './statObject.js'
import _ from 'lodash'

export default class Stats{

  _cache = {}
  baseAffectors = []
  additionalAffectors = []

  /**
   * @param baseStats {[object],object,Stats}
   * @param additionalStats {[object],object,Stats}
   */
  constructor(baseStats = null, additionalStats = null){
    this.baseAffectors = toAffectorsArray(baseStats)
    this.additionalAffectors = toAffectorsArray(additionalStats)
  }

  get isEmpty(){
    return this.affectors.find(a => Object.keys(a).length) ? false : true
  }

  get affectors(){
    return this.baseAffectors.concat(this.additionalAffectors)
  }

  get(nameOrStat){

    const name = nameOrStat.name ?? nameOrStat

    if(this._cache[name]){
      return this._cache[name]
    }

    const statObj = makeStatObject(name)

    const fn = statValueFns[statObj.type]

    if(!fn){
      throw 'Missing value function for stat type: ' + statObj.type
    }

    const base = fn(extractValues(this.baseAffectors, name), statObj.defaultValue)
    statObj.baseValue = shine(base.value)
    statObj.baseMods = base.mods

    const current = fn(extractValues(this.affectors, name), statObj.defaultValue)
    statObj.value = shine(current.value)
    statObj.mods = current.mods

    statObj.diff = calcStatDiff(statObj)

    this._cache[name] = statObj

    return statObj

    function extractValues(affectors, name){
      return affectors
        .map(affector => affector[name] || null)
        .filter(val => val)
    }

    function shine(val){
      if(_.isNumber(statObj.minValue)){
        val = Math.max(statObj.minValue, val)
      }
      if(_.isNumber(statObj.maxValue)){
        val = Math.min(statObj.maxValue, val)
      }
      return roundToFixed(val, statObj.roundingDecimals)
    }
  }

  getAll(forced = []){
    const all = {}
    forced.forEach(name => all[name] = true)
    this.affectors.forEach(affector => {
      Object.keys(affector).forEach(key => {
        all[key] = true
      })
    })
    const allStats = {}
    Object.keys(all).forEach(type => {
      const stat = this.get(type)
      // if(stat.defaultValue === stat.value && forced.indexOf(type) === -1){
      //   return
      // }
      allStats[type] = stat
    })
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

export function mergeStats(...statsObjs){
  return new Stats(
    merge('baseAffectors'),
    merge('additionalAffectors')
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
 * @param val Turn whatever nonsense into a nice affectors array.
 * @returns [object]
 */
function toAffectorsArray(val){
  if(!val){
    return []
  }
  const arr = Array.isArray(val) ? val : [val]
  const affectors = []
  arr.forEach(value => {
    if(value instanceof Stats){
      affectors.push(...value.affectors)
    }else if(Array.isArray(value)){
      affectors.push(...toAffectorsArray(value))
    }else{
      affectors.push(value)
    }
  })
  return affectors.filter(a => a)
}